import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: aulas } = await supabase
      .from('aulas')
      .select('id, turma_id, disciplina_id')
      .eq('professor_id', user?.id);

    const turmaIds = [...new Set(aulas?.map((a: any) => a.turma_id) || [])];

    let query = supabase.from('notas').select(`
      *,
      alunos(nome_completo),
      disciplinas(nome),
      turmas(nome)
    `);

    if (turmaIds.length > 0) {
      query = query.in('turma_id', turmaIds);
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
