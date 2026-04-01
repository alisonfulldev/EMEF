import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { alunoId: string } }) {
  try {
    const supabase = await createClient();

    const { data: registros } = await supabase
      .from('registros_chamada')
      .select()
      .eq('aluno_id', params.alunoId);

    const total = registros?.length || 0;
    const presencas = registros?.filter((r: any) => r.status === 'presença').length || 0;

    return NextResponse.json({
      total_aulas: total,
      presencas,
      taxa: total > 0 ? Math.round((presencas / total) * 100) : 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
