import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ discId: string }> }) {
  try {
    const { discId } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from('disciplinas').delete().eq('id', discId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
