// Fixtures para testes de autenticação

export const mockUser = {
  id: 'test-user-1',
  email: 'teste@example.com',
  user_metadata: {
    nome: 'Usuário Teste',
    tipo: 'admin',
  },
  created_at: new Date().toISOString(),
};

export const mockTeacher = {
  id: 'teacher-1',
  email: 'professor@example.com',
  user_metadata: {
    nome: 'Professor Teste',
    tipo: 'professor',
  },
  created_at: new Date().toISOString(),
};

export const mockStudent = {
  id: 'student-1',
  email: 'aluno@example.com',
  user_metadata: {
    nome: 'Aluno Teste',
    tipo: 'aluno',
  },
  created_at: new Date().toISOString(),
};

export const mockGuardian = {
  id: 'guardian-1',
  email: 'responsavel@example.com',
  user_metadata: {
    nome: 'Responsável Teste',
    tipo: 'responsavel',
  },
  created_at: new Date().toISOString(),
};

export const mockLoginResponse = {
  user: mockUser,
  session: {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
  },
};

export const mockSignUpData = {
  email: 'novousuario@example.com',
  password: 'SecurePassword123!',
  userData: {
    nome: 'Novo Usuário',
    tipo: 'professor',
  },
};

export const mockLoginData = {
  email: 'teste@example.com',
  password: 'SecurePassword123!',
};
