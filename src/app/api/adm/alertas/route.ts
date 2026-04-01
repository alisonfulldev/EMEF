import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: chamadas, error } = await supabase
      .from('registros_chamada')
      .select(`
        aluno_id,
        status,
        alunos(id, nome_completo, turma_id, turmas(nome))
      `)
      .order('criado_em', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const alunoStats = new Map();
    chamadas.forEach((c: any) => {
      const key = c.aluno_id;
      if (!alunoStats.has(key)) {
        alunoStats.set(key, {
          aluno_id: c.aluno_id,
          aluno_nome: c.alunos?.nome_completo,
          turma_nome: c.alunos?.turmas?.nome,
          total_aulas: 0,
          total_faltas: 0,
        });
      }
      const stat = alunoStats.get(key);
      stat.total_aulas++;
      if (c.status === 'falta') stat.total_faltas++;
    });

    const alertas = Array.from(alunoStats.values())
      .map((s: any) => ({
        ...s,
        frequencia: s.total_aulas > 0 ? Math.round(((s.total_aulas - s.total_faltas) / s.total_aulas) * 100) : 0,
      }))
      .filter((s: any) => s.frequencia < 75);

    return NextResponse.json(alertas);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
