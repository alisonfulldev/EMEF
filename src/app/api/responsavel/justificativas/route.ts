import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: responsavel } = await supabase
      .from('responsaveis')
      .select('id')
      .eq('usuario_id', user?.id)
      .single();

    const { data, error } = await supabase
      .from('justificativas')
      .select()
      .eq('enviado_por', user?.id)
      .order('criado_em', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const body = await request.json();

    const { data, error } = await supabase
      .from('justificativas')
      .insert([{ ...body, enviado_por: user?.id, status: 'pendente' }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
