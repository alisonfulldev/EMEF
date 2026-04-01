import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: registros } = await supabase
      .from('registros_chamada')
      .select(`
        aluno_id,
        status,
        criado_em,
        alunos(matricula, nome_completo),
        chamadas(data)
      `)
      .order('criado_em');

    const alunosMap = new Map();

    registros?.forEach((r: any) => {
      const key = r.aluno_id;
      if (!alunosMap.has(key)) {
        alunosMap.set(key, {
          matricula: r.alunos?.matricula,
          nome: r.alunos?.nome_completo,
          presencas: 0,
          faltas: 0,
          atrasos: 0,
          justificadas: 0,
        });
      }

      const aluno = alunosMap.get(key);
      if (r.status === 'presença') aluno.presencas++;
      else if (r.status === 'falta') aluno.faltas++;
      else if (r.status === 'atraso') aluno.atrasos++;
      else if (r.status === 'justificada') aluno.justificadas++;
    });

    const data = Array.from(alunosMap.values());

    return NextResponse.json({
      filename: `frequencia_${new Date().toISOString().split('T')[0]}.json`,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
