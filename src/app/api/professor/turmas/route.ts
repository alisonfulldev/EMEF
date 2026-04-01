import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is professor
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('perfil')
      .eq('id', user.id)
      .single();

    if (!usuario || usuario.perfil !== 'professor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get turmas for this professor (unique via aulas)
    const { data, error } = await supabase
      .from('aulas')
      .select(
        `
        turma_id,
        turmas:turma_id(
          id,
          nome,
          turno,
          ano_letivo_id
        )
      `
      )
      .eq('professor_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Remove duplicates
    const turmas = data?.map((a: any) => a.turmas).filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.id === v.id) === i) || [];

    return NextResponse.json(turmas);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
