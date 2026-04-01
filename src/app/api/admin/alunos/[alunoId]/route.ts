import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ alunoId: string }> }) {
  try {
    const { alunoId } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('alunos')
      .select('*, turmas(nome)')
      .eq('id', alunoId)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ alunoId: string }> }) {
  try {
    const { alunoId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from('alunos')
      .update(body)
      .eq('id', alunoId)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ alunoId: string }> }) {
  try {
    const { alunoId } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from('alunos').delete().eq('id', alunoId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
