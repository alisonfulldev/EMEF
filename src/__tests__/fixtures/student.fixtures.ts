// Fixtures para testes de alunos

export const mockStudent = {
  id: 'student-1',
  nome: 'João Silva',
  email: 'joao@example.com',
  matricula: '2024001',
  cpf: '12345678901',
  data_nascimento: '2010-05-15',
  genero: 'M',
  endereco: 'Rua das Flores, 123',
  cidade: 'Narandiba',
  estado: 'BA',
  cep: '46860000',
  telefone: '7734251234',
  responsavel_id: 'guardian-1',
  turma_id: 'class-1',
  status: 'ativo',
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
};

export const mockStudent2 = {
  id: 'student-2',
  nome: 'Maria Santos',
  email: 'maria@example.com',
  matricula: '2024002',
  cpf: '98765432109',
  data_nascimento: '2009-03-20',
  genero: 'F',
  endereco: 'Av. Principal, 456',
  cidade: 'Narandiba',
  estado: 'BA',
  cep: '46860000',
  telefone: '7734251235',
  responsavel_id: 'guardian-2',
  turma_id: 'class-1',
  status: 'ativo',
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
};

export const mockStudentList = [mockStudent, mockStudent2];

export const mockCreateStudentData = {
  nome: 'Pedro Oliveira',
  email: 'pedro@example.com',
  matricula: '2024003',
  cpf: '55555555555',
  data_nascimento: '2010-07-10',
  genero: 'M',
  endereco: 'Rua Nova, 789',
  cidade: 'Narandiba',
  estado: 'BA',
  cep: '46860000',
  telefone: '7734251236',
  responsavel_id: 'guardian-3',
  turma_id: 'class-2',
};

export const mockUpdateStudentData = {
  nome: 'João Silva Updated',
  email: 'joao.updated@example.com',
  telefone: '7734251240',
};

export const mockAttendanceRecord = {
  id: 'attendance-1',
  aluno_id: 'student-1',
  aula_id: 'class-1',
  data: new Date().toISOString().split('T')[0],
  presente: true,
  justificado: false,
  observacao: '',
};

export const mockGradeRecord = {
  id: 'grade-1',
  aluno_id: 'student-1',
  disciplina_id: 'subject-1',
  bimestre: 1,
  valor: 8.5,
  tipo: 'prova',
  data: new Date().toISOString(),
};
