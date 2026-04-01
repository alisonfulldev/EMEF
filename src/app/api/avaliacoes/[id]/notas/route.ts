import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: avaliacao, error: avalError } = await supabase
      .from('avaliacoes')
      .select('turma_id')
      .eq('id', id)
      .single();

    if (avalError) return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });

    const { data: alunos } = await supabase
      .from('alunos')
      .select('id, nome_completo')
      .eq('turma_id', avaliacao.turma_id);

    const { data: notas } = await supabase
      .from('notas_avaliacao')
      .select()
      .eq('avaliacao_id', id);

    const notasMap = new Map(notas?.map((n: any) => [n.aluno_id, n]) || []);

    const resultado = alunos?.map((a: any) => ({
      aluno_id: a.id,
      aluno_nome: a.nome_completo,
      nota: notasMap.get(a.id)?.nota || null,
    })) || [];

    return NextResponse.json(resultado);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { notas } = await request.json();

    const registros = notas
      .filter((n: any) => n.nota !== null && n.nota !== undefined)
      .map((n: any) => ({
        avaliacao_id: id,
        aluno_id: n.aluno_id,
        nota: n.nota,
        registrado_por: user?.id,
        registrado_em: new Date().toISOString(),
      }));

    const { error } = await supabase
      .from('notas_avaliacao')
      .upsert(registros, { onConflict: 'avaliacao_id,aluno_id' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
