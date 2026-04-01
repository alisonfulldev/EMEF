import { FormError } from '@/types';

// Validação de Chamada
export function validateRegistroChamada(status: string): FormError | null {
  const validStatus = ['presença', 'falta', 'atraso', 'justificada'];
  if (!validStatus.includes(status)) {
    return { field: 'status', message: 'Status de chamada inválido' };
  }
  return null;
}

// Validação de Notas
export function validateNota(nota: number | null | undefined, valorMaximo: number): FormError | null {
  if (nota === null || nota === undefined) {
    return null; // Nota nula é válida
  }

  if (isNaN(nota)) {
    return { field: 'nota', message: 'Nota deve ser um número' };
  }

  if (nota < 0) {
    return { field: 'nota', message: 'Nota não pode ser negativa' };
  }

  if (nota > valorMaximo) {
    return {
      field: 'nota',
      message: `Nota não pode ser maior que ${valorMaximo}`,
    };
  }

  return null;
}

// Validação de Justificativa
export function validateJustificativa(
  data_falta: string,
  motivo: string
): FormError | null {
  if (!data_falta) {
    return { field: 'data_falta', message: 'Data da falta é obrigatória' };
  }

  const dataFalta = new Date(data_falta);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataFalta > hoje) {
    return { field: 'data_falta', message: 'Data não pode ser futura' };
  }

  if (!motivo || motivo.trim().length === 0) {
    return { field: 'motivo', message: 'Motivo é obrigatório' };
  }

  if (motivo.trim().length < 10) {
    return { field: 'motivo', message: 'Motivo deve ter pelo menos 10 caracteres' };
  }

  return null;
}

// Validação de Aluno
export function validateAluno(
  nome_completo: string,
  matricula: string,
  numero_chamada?: number
): FormError | null {
  if (!nome_completo || nome_completo.trim().length === 0) {
    return { field: 'nome_completo', message: 'Nome completo é obrigatório' };
  }

  if (nome_completo.trim().length < 5) {
    return { field: 'nome_completo', message: 'Nome deve ter pelo menos 5 caracteres' };
  }

  if (!matricula || matricula.trim().length === 0) {
    return { field: 'matricula', message: 'Matrícula é obrigatória' };
  }

  if (numero_chamada !== undefined && numero_chamada !== null) {
    if (numero_chamada <= 0) {
      return { field: 'numero_chamada', message: 'Número de chamada deve ser positivo' };
    }
  }

  return null;
}

// Validação de Turma
export function validateTurma(nome: string, turno: string): FormError | null {
  if (!nome || nome.trim().length === 0) {
    return { field: 'nome', message: 'Nome da turma é obrigatório' };
  }

  const turnosValidos = ['matutino', 'vespertino', 'noturno'];
  if (!turnosValidos.includes(turno)) {
    return { field: 'turno', message: 'Turno inválido' };
  }

  return null;
}

// Validação de Aula
export function validateAula(
  data: string,
  horario_inicio: string,
  horario_fim: string
): FormError | null {
  if (!data) {
    return { field: 'data', message: 'Data é obrigatória' };
  }

  if (!horario_inicio) {
    return { field: 'horario_inicio', message: 'Horário inicial é obrigatório' };
  }

  if (!horario_fim) {
    return { field: 'horario_fim', message: 'Horário final é obrigatório' };
  }

  const [hI, mI] = horario_inicio.split(':').map(Number);
  const [hF, mF] = horario_fim.split(':').map(Number);

  const minutoInicio = hI * 60 + mI;
  const minutoFim = hF * 60 + mF;

  if (minutoFim <= minutoInicio) {
    return {
      field: 'horario_fim',
      message: 'Horário final deve ser após horário inicial',
    };
  }

  return null;
}

// Validação de Avaliação
export function validateAvaliacao(
  titulo: string,
  tipo: string,
  data_aplicacao: string,
  valor_maximo: number
): FormError | null {
  if (!titulo || titulo.trim().length === 0) {
    return { field: 'titulo', message: 'Título é obrigatório' };
  }

  const tiposValidos = ['prova', 'trabalho', 'participacao', 'outro'];
  if (!tiposValidos.includes(tipo)) {
    return { field: 'tipo', message: 'Tipo de avaliação inválido' };
  }

  if (!data_aplicacao) {
    return { field: 'data_aplicacao', message: 'Data de aplicação é obrigatória' };
  }

  if (valor_maximo <= 0) {
    return { field: 'valor_maximo', message: 'Valor máximo deve ser positivo' };
  }

  if (valor_maximo > 100) {
    return { field: 'valor_maximo', message: 'Valor máximo não pode exceder 100' };
  }

  return null;
}

// Validação genérica de campos obrigatórios
export function validateRequired(
  value: any,
  fieldName: string,
  minLength?: number
): FormError | null {
  if (value === null || value === undefined || value === '') {
    return { field: fieldName, message: `${fieldName} é obrigatório` };
  }

  if (typeof value === 'string' && minLength && value.trim().length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} deve ter pelo menos ${minLength} caracteres`,
    };
  }

  return null;
}

// Validação de data no intervalo
export function validateDateRange(
  data: string,
  dataInicio: string,
  dataFim: string
): FormError | null {
  const date = new Date(data);
  const dateStart = new Date(dataInicio);
  const dateEnd = new Date(dataFim);

  if (date < dateStart || date > dateEnd) {
    return {
      field: 'data',
      message: `Data deve estar entre ${dataInicio} e ${dataFim}`,
    };
  }

  return null;
}

// Validação de arquivo Excel
export function validateExcelFile(file: File): FormError | null {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  if (!validTypes.includes(file.type)) {
    return { field: 'arquivo', message: 'Arquivo deve ser um arquivo Excel (.xlsx ou .xls)' };
  }

  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      field: 'arquivo',
      message: `Arquivo não pode ter mais de ${maxSizeMB}MB`,
    };
  }

  return null;
}
