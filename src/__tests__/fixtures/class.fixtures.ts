// Fixtures para testes de turmas

export const mockClass = {
  id: 'class-1',
  nome: '5º Ano A',
  ano_letivo: 2024,
  serie: '5',
  turno: 'matutino',
  professor_id: 'teacher-1',
  capacidade: 30,
  alunos_count: 25,
  status: 'ativo',
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
};

export const mockClass2 = {
  id: 'class-2',
  nome: '5º Ano B',
  ano_letivo: 2024,
  serie: '5',
  turno: 'vespertino',
  professor_id: 'teacher-2',
  capacidade: 28,
  alunos_count: 23,
  status: 'ativo',
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
};

export const mockClassList = [mockClass, mockClass2];

export const mockCreateClassData = {
  nome: '4º Ano A',
  ano_letivo: 2024,
  serie: '4',
  turno: 'matutino',
  professor_id: 'teacher-3',
  capacidade: 30,
};

export const mockUpdateClassData = {
  nome: '5º Ano A - Atualizado',
  professor_id: 'teacher-2',
  capacidade: 32,
};

export const mockLesson = {
  id: 'lesson-1',
  turma_id: 'class-1',
  disciplina_id: 'subject-1',
  data: new Date().toISOString().split('T')[0],
  hora_inicio: '08:00',
  hora_fim: '09:00',
  conteudo: 'Frações e operações básicas',
  professor_id: 'teacher-1',
  criado_em: new Date().toISOString(),
};

export const mockSubject = {
  id: 'subject-1',
  nome: 'Matemática',
  codigo: 'MAT001',
  professor_id: 'teacher-1',
  carga_horaria: 120,
  status: 'ativo',
  criado_em: new Date().toISOString(),
};

export const mockSubjectList = [
  mockSubject,
  {
    id: 'subject-2',
    nome: 'Português',
    codigo: 'PORT001',
    professor_id: 'teacher-2',
    carga_horaria: 120,
    status: 'ativo',
    criado_em: new Date().toISOString(),
  },
];
