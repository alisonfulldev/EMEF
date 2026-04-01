import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ usuarioId: string }> }) {
  try {
    const { usuarioId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from('usuarios')
      .update(body)
      .eq('id', usuarioId)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
