import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ anoId: string }> }) {
  try {
    const { anoId } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from('ano_letivo').delete().eq('id', anoId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
