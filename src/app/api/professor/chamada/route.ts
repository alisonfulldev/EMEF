import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const aulaId = searchParams.get('aulaId');

    const { data: aula, error: aulaError } = await supabase
      .from('aulas')
      .select('turma_id')
      .eq('id', aulaId)
      .single();

    if (aulaError) return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 });

    const { data: alunos, error: alunosError } = await supabase
      .from('alunos')
      .select()
      .eq('turma_id', aula.turma_id);

    if (alunosError) return NextResponse.json({ error: alunosError.message }, { status: 400 });
    return NextResponse.json(alunos);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { aula_id, registros } = await request.json();

    const { data: chamada, error: chamadaError } = await supabase
      .from('chamadas')
      .insert([{ aula_id, status: 'concluida' }])
      .select()
      .single();

    if (chamadaError) return NextResponse.json({ error: chamadaError.message }, { status: 400 });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const registrosList = registros.map((r: any) => ({
      ...r,
      chamada_id: chamada.id,
      registrado_por: user?.id,
    }));

    const { data, error } = await supabase.from('registros_chamada').insert(registrosList);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
