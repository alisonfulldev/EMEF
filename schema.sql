-- =====================================================
-- SISTEMA ESCOLA - Schema Completo Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS (Tipos enumerados)
-- =====================================================

CREATE TYPE perfil_enum AS ENUM ('professor', 'responsavel', 'admin', 'secretaria', 'diretor', 'cozinha');
CREATE TYPE turno_enum AS ENUM ('matutino', 'vespertino', 'noturno');
CREATE TYPE status_chamada_enum AS ENUM ('iniciada', 'concluida', 'cancelada');
CREATE TYPE status_registro_enum AS ENUM ('presença', 'falta', 'atraso', 'justificada');
CREATE TYPE status_justificativa_enum AS ENUM ('pendente', 'aprovada', 'rejeitada');
CREATE TYPE tipo_avaliacao_enum AS ENUM ('prova', 'trabalho', 'participacao', 'outro');

-- =====================================================
-- TABELAS
-- =====================================================

-- usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  nome VARCHAR NOT NULL,
  perfil perfil_enum NOT NULL,
  ativo BOOLEAN DEFAULT true,
  foto_url VARCHAR,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- escola
CREATE TABLE escola (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  sigla VARCHAR,
  endereco VARCHAR,
  cidade VARCHAR,
  estado VARCHAR,
  telefone VARCHAR,
  email VARCHAR,
  diretor_id UUID REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ano_letivo
CREATE TABLE ano_letivo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ano INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  ativo BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ano)
);

-- turmas
CREATE TABLE turmas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  turno turno_enum NOT NULL,
  ano_letivo_id UUID NOT NULL REFERENCES ano_letivo(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(nome, ano_letivo_id)
);

-- disciplinas
CREATE TABLE disciplinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- alunos
CREATE TABLE alunos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_completo VARCHAR NOT NULL,
  data_nascimento DATE,
  numero_chamada INTEGER,
  matricula VARCHAR UNIQUE NOT NULL,
  turma_id UUID NOT NULL REFERENCES turmas(id),
  foto_url VARCHAR,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(numero_chamada, turma_id)
);

-- professores
CREATE TABLE professores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id),
  especialidade VARCHAR,
  formacao VARCHAR,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- responsaveis
CREATE TABLE responsaveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id),
  crm VARCHAR,
  profissao VARCHAR,
  telefone VARCHAR,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- responsaveis_alunos (junction table)
CREATE TABLE responsaveis_alunos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  responsavel_id UUID NOT NULL REFERENCES responsaveis(id),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  grau_parentesco VARCHAR,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(responsavel_id, aluno_id)
);

-- aulas
CREATE TABLE aulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  turma_id UUID NOT NULL REFERENCES turmas(id),
  disciplina_id UUID NOT NULL REFERENCES disciplinas(id),
  professor_id UUID NOT NULL REFERENCES usuarios(id),
  data DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  sala VARCHAR,
  conteudo_planejado TEXT,
  atividade_planejada TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT horario_valido CHECK (horario_fim > horario_inicio)
);

-- chamadas
CREATE TABLE chamadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aula_id UUID NOT NULL REFERENCES aulas(id),
  turma_id UUID NOT NULL REFERENCES turmas(id),
  data DATE NOT NULL,
  status status_chamada_enum DEFAULT 'iniciada',
  iniciada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  concluida_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- registros_chamada
CREATE TABLE registros_chamada (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chamada_id UUID NOT NULL REFERENCES chamadas(id),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  status status_registro_enum DEFAULT 'presença',
  observacao TEXT,
  motivo_alteracao VARCHAR,
  horario_evento TIME,
  registrado_por UUID NOT NULL REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chamada_id, aluno_id)
);

-- justificativas
CREATE TABLE justificativas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  data_falta DATE NOT NULL,
  motivo VARCHAR NOT NULL,
  status status_justificativa_enum DEFAULT 'pendente',
  enviado_por UUID NOT NULL REFERENCES usuarios(id),
  aprovado_por UUID REFERENCES usuarios(id),
  aprovado_em TIMESTAMP,
  observacao_aprovacao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- justificativas_falta (junction table)
CREATE TABLE justificativas_falta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_chamada_id UUID NOT NULL REFERENCES registros_chamada(id),
  justificativa_id UUID NOT NULL REFERENCES justificativas(id),
  responsavel_id UUID NOT NULL REFERENCES responsaveis(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(registro_chamada_id, justificativa_id)
);

-- avaliacoes
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  turma_id UUID NOT NULL REFERENCES turmas(id),
  disciplina_id UUID NOT NULL REFERENCES disciplinas(id),
  aula_id UUID REFERENCES aulas(id),
  titulo VARCHAR NOT NULL,
  tipo tipo_avaliacao_enum NOT NULL,
  data_aplicacao DATE NOT NULL,
  data_entrega DATE,
  valor_maximo DECIMAL DEFAULT 10,
  descricao TEXT,
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- notas_avaliacao
CREATE TABLE notas_avaliacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  nota DECIMAL CHECK (nota >= 0 AND nota <= 99.9),
  observacao TEXT,
  registrado_por UUID NOT NULL REFERENCES usuarios(id),
  registrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(avaliacao_id, aluno_id)
);

-- notas (notas bimestrais)
CREATE TABLE notas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  disciplina_id UUID NOT NULL REFERENCES disciplinas(id),
  turma_id UUID NOT NULL REFERENCES turmas(id),
  ano_letivo_id UUID NOT NULL REFERENCES ano_letivo(id),
  bimestre INTEGER CHECK (bimestre >= 1 AND bimestre <= 4),
  nota DECIMAL CHECK (nota >= 0 AND nota <= 10),
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(aluno_id, disciplina_id, turma_id, ano_letivo_id, bimestre)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX idx_alunos_turma ON alunos(turma_id);
CREATE INDEX idx_alunos_matricula ON alunos(matricula);
CREATE INDEX idx_responsaveis_alunos_responsavel ON responsaveis_alunos(responsavel_id);
CREATE INDEX idx_responsaveis_alunos_aluno ON responsaveis_alunos(aluno_id);
CREATE INDEX idx_aulas_turma ON aulas(turma_id);
CREATE INDEX idx_aulas_professor ON aulas(professor_id);
CREATE INDEX idx_aulas_data ON aulas(data);
CREATE INDEX idx_chamadas_aula ON chamadas(aula_id);
CREATE INDEX idx_chamadas_turma ON chamadas(turma_id);
CREATE INDEX idx_chamadas_data ON chamadas(data);
CREATE INDEX idx_registros_chamada_aluno ON registros_chamada(aluno_id);
CREATE INDEX idx_registros_chamada_chamada ON registros_chamada(chamada_id);
CREATE INDEX idx_justificativas_aluno ON justificativas(aluno_id);
CREATE INDEX idx_justificativas_status ON justificativas(status);
CREATE INDEX idx_avaliacoes_turma ON avaliacoes(turma_id);
CREATE INDEX idx_avaliacoes_disciplina ON avaliacoes(disciplina_id);
CREATE INDEX idx_notas_avaliacao_avaliacao ON notas_avaliacao(avaliacao_id);
CREATE INDEX idx_notas_avaliacao_aluno ON notas_avaliacao(aluno_id);
CREATE INDEX idx_notas_aluno ON notas(aluno_id);
CREATE INDEX idx_notas_disciplina ON notas(disciplina_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE escola ENABLE ROW LEVEL SECURITY;
ALTER TABLE ano_letivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsaveis_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_chamada ENABLE ROW LEVEL SECURITY;
ALTER TABLE justificativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE justificativas_falta ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_avaliacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;

-- usuarios RLS
CREATE POLICY usuarios_select_own ON usuarios FOR SELECT USING (
  auth.uid()::text = id::text OR
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

CREATE POLICY usuarios_update_own ON usuarios FOR UPDATE USING (
  auth.uid()::text = id::text OR
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

CREATE POLICY usuarios_delete_admin ON usuarios FOR DELETE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

-- alunos RLS (professor das turmas, responsável dos filhos, admin)
CREATE POLICY alunos_select ON alunos FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'professor'
  OR EXISTS (
    SELECT 1 FROM responsaveis_alunos ra
    JOIN responsaveis r ON ra.responsavel_id = r.id
    WHERE ra.aluno_id = alunos.id AND r.usuario_id = auth.uid()::uuid
  )
);

CREATE POLICY alunos_update_admin ON alunos FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

CREATE POLICY alunos_delete_admin ON alunos FOR DELETE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

-- chamadas RLS
CREATE POLICY chamadas_select ON chamadas FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM aulas a
    WHERE a.id = chamadas.aula_id AND a.professor_id = auth.uid()::uuid
  )
);

CREATE POLICY chamadas_insert ON chamadas FOR INSERT WITH CHECK (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM aulas a
    WHERE a.id = chamadas.aula_id AND a.professor_id = auth.uid()::uuid
  )
);

CREATE POLICY chamadas_update ON chamadas FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM aulas a
    WHERE a.id = chamadas.aula_id AND a.professor_id = auth.uid()::uuid
  )
);

-- registros_chamada RLS
CREATE POLICY registros_chamada_select ON registros_chamada FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM chamadas c
    JOIN aulas a ON c.aula_id = a.id
    WHERE c.id = registros_chamada.chamada_id AND a.professor_id = auth.uid()::uuid
  )
  OR EXISTS (
    SELECT 1 FROM responsaveis_alunos ra
    JOIN responsaveis r ON ra.responsavel_id = r.id
    WHERE ra.aluno_id = registros_chamada.aluno_id AND r.usuario_id = auth.uid()::uuid
  )
);

CREATE POLICY registros_chamada_insert ON registros_chamada FOR INSERT WITH CHECK (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM chamadas c
    JOIN aulas a ON c.aula_id = a.id
    WHERE c.id = registros_chamada.chamada_id AND a.professor_id = auth.uid()::uuid
  )
);

CREATE POLICY registros_chamada_update ON registros_chamada FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM chamadas c
    JOIN aulas a ON c.aula_id = a.id
    WHERE c.id = registros_chamada.chamada_id AND a.professor_id = auth.uid()::uuid
  )
);

-- justificativas RLS
CREATE POLICY justificativas_select ON justificativas FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'responsavel'
    AND enviado_por = auth.uid()::uuid
);

CREATE POLICY justificativas_insert ON justificativas FOR INSERT WITH CHECK (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'responsavel'
);

CREATE POLICY justificativas_update ON justificativas FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
);

-- avaliacoes RLS
CREATE POLICY avaliacoes_select ON avaliacoes FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR criado_por = auth.uid()::uuid
);

CREATE POLICY avaliacoes_insert ON avaliacoes FOR INSERT WITH CHECK (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'professor'
);

CREATE POLICY avaliacoes_update ON avaliacoes FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR criado_por = auth.uid()::uuid
);

CREATE POLICY avaliacoes_delete ON avaliacoes FOR DELETE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR criado_por = auth.uid()::uuid
);

-- notas_avaliacao RLS
CREATE POLICY notas_avaliacao_select ON notas_avaliacao FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR registrado_por = auth.uid()::uuid
  OR EXISTS (
    SELECT 1 FROM responsaveis_alunos ra
    JOIN responsaveis r ON ra.responsavel_id = r.id
    WHERE ra.aluno_id = notas_avaliacao.aluno_id AND r.usuario_id = auth.uid()::uuid
  )
);

CREATE POLICY notas_avaliacao_insert ON notas_avaliacao FOR INSERT WITH CHECK (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'professor'
);

CREATE POLICY notas_avaliacao_update ON notas_avaliacao FOR UPDATE USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR registrado_por = auth.uid()::uuid
);

-- All users can read públic tables
CREATE POLICY turmas_select ON turmas FOR SELECT USING (true);
CREATE POLICY disciplinas_select ON disciplinas FOR SELECT USING (true);
CREATE POLICY ano_letivo_select ON ano_letivo FOR SELECT USING (true);
CREATE POLICY escola_select ON escola FOR SELECT USING (true);
CREATE POLICY aulas_select ON aulas FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR professor_id = auth.uid()::uuid
);
CREATE POLICY professores_select ON professores FOR SELECT USING (true);
CREATE POLICY responsaveis_select ON responsaveis FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR usuario_id = auth.uid()::uuid
);
CREATE POLICY responsaveis_alunos_select ON responsaveis_alunos FOR SELECT USING (true);
CREATE POLICY justificativas_falta_select ON justificativas_falta FOR SELECT USING (true);
CREATE POLICY notas_select ON notas FOR SELECT USING (
  (SELECT perfil FROM usuarios WHERE id = auth.uid()::uuid) = 'admin'
  OR EXISTS (
    SELECT 1 FROM responsaveis_alunos ra
    JOIN responsaveis r ON ra.responsavel_id = r.id
    WHERE ra.aluno_id = notas.aluno_id AND r.usuario_id = auth.uid()::uuid
  )
);
