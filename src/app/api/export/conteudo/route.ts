import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: aulas } = await supabase
      .from('aulas')
      .select(`
        data,
        conteudo_planejado,
        atividade_planejada,
        turmas(nome),
        disciplinas(nome),
        usuarios(nome)
      `)
      .order('data');

    const data = aulas?.map((a: any) => ({
      data: a.data,
      turma: a.turmas?.nome,
      disciplina: a.disciplinas?.nome,
      professor: a.usuarios?.nome,
      conteudo: a.conteudo_planejado,
      atividade: a.atividade_planejada,
    })) || [];

    return NextResponse.json({
      filename: `conteudo_${new Date().toISOString().split('T')[0]}.json`,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
