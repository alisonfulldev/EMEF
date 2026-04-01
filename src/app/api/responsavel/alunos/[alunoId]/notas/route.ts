import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { alunoId: string } }) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('notas')
      .select(`
        *,
        disciplinas(nome)
      `)
      .eq('aluno_id', params.alunoId)
      .order('bimestre');

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const formatted = data?.map((n: any) => ({
      ...n,
      disciplina_nome: n.disciplinas?.nome,
    })) || [];

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
