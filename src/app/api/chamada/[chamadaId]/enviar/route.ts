import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chamadaId: string }> }
) {
  try {
    const { chamadaId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get chamada with aula info
    const { data: chamada } = await supabase
      .from('chamadas')
      .select('id, aula_id')
      .eq('id', chamadaId)
      .single();

    if (!chamada) {
      return NextResponse.json(
        { error: 'Chamada not found' },
        { status: 404 }
      );
    }

    // Get aula data
    const { data: aula } = await supabase
      .from('aulas')
      .select('data, turma_id')
      .eq('id', chamada.aula_id)
      .single();

    // Get turma name
    let turmaName = 'Turma';
    if (aula?.turma_id) {
      const { data: turma } = await supabase
        .from('turmas')
        .select('nome')
        .eq('id', aula.turma_id)
        .single();
      if (turma) turmaName = turma.nome;
    }

    // Get all registros with status='falta'
    const { data: registrosFalta } = await supabase
      .from('registros_chamada')
      .select('aluno_id')
      .eq('chamada_id', chamadaId)
      .eq('status', 'falta');

    if (!registrosFalta || registrosFalta.length === 0) {
      return NextResponse.json({ enviados: 0, ignorados: 0 });
    }

    // Get escola name
    const { data: escola } = await supabase
      .from('escola')
      .select('nome')
      .single();

    const escolaNome = escola?.nome || 'Escola';
    const dataFormatada = aula?.data
      ? new Date(aula.data).toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('pt-BR');

    let enviados = 0;
    let ignorados = 0;

    // Send emails for each aluno with falta
    for (const registro of registrosFalta) {
      const alunoId = registro.aluno_id;

      // Get aluno info
      const { data: aluno } = await supabase
        .from('alunos')
        .select('nome_completo')
        .eq('id', alunoId)
        .single();

      const alunoNome = aluno?.nome_completo || 'Aluno';

      // Get responsaveis for this student
      const { data: responsavelLinks } = await supabase
        .from('responsaveis_alunos')
        .select('responsavel_id')
        .eq('aluno_id', alunoId);

      if (!responsavelLinks || responsavelLinks.length === 0) {
        ignorados++;
        continue;
      }

      // For each responsavel, get their email and send
      for (const link of responsavelLinks) {
        // Get responsavel info
        const { data: responsavel } = await supabase
          .from('responsaveis')
          .select('usuario_id')
          .eq('id', link.responsavel_id)
          .single();

        if (!responsavel) {
          ignorados++;
          continue;
        }

        // Get usuario email
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('email, nome')
          .eq('id', responsavel.usuario_id)
          .single();

        if (!usuario?.email) {
          ignorados++;
          continue;
        }

        const subject = `Notificação de Ausência - ${alunoNome}`;
        const responsavelNome = usuario.nome || 'Responsável';
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <h2 style="color: #333; margin-top: 0;">Notificação de Ausência</h2>

              <p>Prezado(a) <strong>${responsavelNome}</strong>,</p>

              <p>Informamos que <strong>${alunoNome}</strong> não compareceu à aula de hoje.</p>

              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Aluno:</strong> ${alunoNome}</p>
                <p style="margin: 5px 0;"><strong>Turma:</strong> ${turmaName}</p>
                <p style="margin: 5px 0;"><strong>Data:</strong> ${dataFormatada}</p>
                <p style="margin: 5px 0;"><strong>Instituição:</strong> ${escolaNome}</p>
              </div>

              <p>Caso tenha alguma dúvida ou explicação sobre a ausência, entre em contato conosco.</p>

              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Atenciosamente,<br>
                <strong>${escolaNome}</strong>
              </p>
            </div>
          </div>
        `;

        const result = await sendEmail({
          to: usuario.email,
          subject,
          html,
        });

        if (result.success) {
          enviados++;
        } else {
          ignorados++;
        }
      }
    }

    return NextResponse.json({
      enviados,
      ignorados,
      message: `${enviados} email(s) enviado(s), ${ignorados} não enviado(s)`,
    });
  } catch (error) {
    console.error('Error sending chamada emails:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
