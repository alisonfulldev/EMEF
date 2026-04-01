import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all students enrollment today with their attendance
    const { data: registros } = await supabase
      .from('registros_chamada')
      .select(`
        aluno_id,
        status,
        chamadas(
          aula_id,
          aulas(
            turma_id,
            turmas(nome)
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Group by turma and count statuses
    const turmaMap = new Map<string, any>();

    registros?.forEach((reg: any) => {
      const turma = reg.chamadas?.aulas?.turmas?.nome;
      if (!turma) return;

      if (!turmaMap.has(turma)) {
        turmaMap.set(turma, {
          turma,
          presentes: 0,
          faltas: 0,
          atrasos: 0,
          justificada: 0,
        });
      }

      const stats = turmaMap.get(turma);
      const status = reg.status;

      if (status === 'presença') stats.presentes++;
      else if (status === 'falta') stats.faltas++;
      else if (status === 'atraso') stats.atrasos++;
      else if (status === 'justificada') stats.justificada++;
    });

    // Get total students per turma
    const { data: turmas } = await supabase
      .from('turmas')
      .select('id, nome, alunos(id)');

    const porTurma = turmas?.map((turma: any) => {
      const stats = turmaMap.get(turma.nome) || {
        turma: turma.nome,
        presentes: 0,
        faltas: 0,
        atrasos: 0,
        justificada: 0,
      };

      const total = turma.alunos?.length || 0;
      const presentes = stats.presentes;
      const taxa = total > 0 ? Math.round((presentes / total) * 100) : 0;

      return {
        turma: turma.nome,
        total_alunos: total,
        presentes,
        faltas: stats.faltas,
        atrasos: stats.atrasos,
        taxa_presenca: taxa,
      };
    }) || [];

    const totalPresentes = porTurma.reduce((sum: number, t: any) => sum + t.presentes, 0);

    return NextResponse.json({
      total_presentes: totalPresentes,
      por_turma: porTurma.sort((a: any, b: any) => a.turma.localeCompare(b.turma)),
    });
  } catch (error) {
    console.error('Error fetching presentes:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
