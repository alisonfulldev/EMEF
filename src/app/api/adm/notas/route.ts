import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('notas')
      .select(`
        id,
        nota,
        bimestre,
        alunos(nome_completo),
        disciplinas(nome),
        turmas(nome)
      `)
      .order('atualizado_em', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const formatted = data.map((n: any) => ({
      id: n.id,
      nota: n.nota,
      bimestre: n.bimestre,
      aluno_nome: n.alunos?.nome_completo,
      disciplina_nome: n.disciplinas?.nome,
      turma_nome: n.turmas?.nome,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
