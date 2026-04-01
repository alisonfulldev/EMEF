import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ turmaId: string }> }) {
  try {
    const { turmaId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from('turmas')
      .update(body)
      .eq('id', turmaId)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ turmaId: string }> }) {
  try {
    const { turmaId } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from('turmas').delete().eq('id', turmaId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
