import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { status, observacao_aprovacao } = await request.json();

    const { data, error } = await supabase
      .from('justificativas')
      .update({
        status,
        observacao_aprovacao,
        aprovado_por: user?.id,
        aprovado_em: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
