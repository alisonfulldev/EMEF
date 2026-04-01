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

    // Check if user is responsavel
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('perfil')
      .eq('id', user.id)
      .single();

    if (!usuario || usuario.perfil !== 'responsavel') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get responsavel
    const { data: responsavel } = await supabase
      .from('responsaveis')
      .select('id')
      .eq('usuario_id', user.id)
      .single();

    if (!responsavel) {
      return NextResponse.json([]);
    }

    // Get alunos for this responsavel
    const { data, error } = await supabase
      .from('responsaveis_alunos')
      .select(
        `
        alunos:aluno_id(
          id,
          nome_completo,
          matricula,
          numero_chamada,
          turma_id,
          turmas:turma_id(nome, turno)
        )
      `
      )
      .eq('responsavel_id', responsavel.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const alunos = data?.map(a => ({
      ...a.alunos,
      turma_nome: a.alunos?.turmas?.nome,
    })) || [];

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
