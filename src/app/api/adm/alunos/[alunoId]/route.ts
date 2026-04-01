import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { alunoId: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('alunos')
      .select('*, turmas(nome)')
      .eq('id', params.alunoId)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
