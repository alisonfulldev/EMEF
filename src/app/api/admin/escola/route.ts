import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('escola').select().single();
    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // First, check if escola exists
    const { data: existing, error: checkError } = await supabase
      .from('escola')
      .select('id')
      .single();

    let data, error;

    if (existing?.id) {
      // Update existing
      ({ data, error } = await supabase
        .from('escola')
        .update(body)
        .eq('id', existing.id)
        .select());
    } else {
      // Create new
      ({ data, error } = await supabase
        .from('escola')
        .insert([body])
        .select());
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
