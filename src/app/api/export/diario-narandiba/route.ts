import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    let query = supabase
      .from('chamadas')
      .select(`
        data,
        turmas(nome),
        aulas(
          disciplinas(nome),
          usuarios(nome),
          conteudo_planejado,
          atividade_planejada
        ),
        registros_chamada(
          alunos(numero_chamada, nome_completo),
          status
        )
      `)
      .order('data');

    if (dataInicio) query = query.gte('data', dataInicio);
    if (dataFim) query = query.lte('data', dataFim);

    const { data: chamadas } = await query;

    const data = chamadas?.map((c: any) => ({
      data: c.data,
      turma: c.turmas?.nome,
      disciplina: c.aulas?.[0]?.disciplinas?.nome,
      professor: c.aulas?.[0]?.usuarios?.nome,
      conteudo: c.aulas?.[0]?.conteudo_planejado,
      atividade: c.aulas?.[0]?.atividade_planejada,
      alunos: c.registros_chamada?.map((r: any) => ({
        numero: r.alunos?.numero_chamada,
        nome: r.alunos?.nome_completo,
        presenca: r.status === 'presença' ? 'P' : r.status === 'falta' ? 'F' : 'A',
      })),
    })) || [];

    return NextResponse.json({
      filename: `diario_narandiba_${new Date().toISOString().split('T')[0]}.json`,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
