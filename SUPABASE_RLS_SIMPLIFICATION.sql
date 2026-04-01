-- Supabase RLS Update Script for Simplified Single-User System
-- This script removes all role-based access controls and allows any authenticated user to access all data
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/[project-id]/sql)

-- Drop existing restrictive policies and replace with open policies for any authenticated user

-- ============================================
-- USUARIOS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select own usuario" ON usuarios;
DROP POLICY IF EXISTS "Allow authenticated to update own usuario" ON usuarios;
DROP POLICY IF EXISTS "Allow authenticated to delete own usuario" ON usuarios;
DROP POLICY IF EXISTS "Allow admin to select all usuarios" ON usuarios;
DROP POLICY IF EXISTS "Allow admin to update usuarios" ON usuarios;
DROP POLICY IF EXISTS "Allow admin to delete usuarios" ON usuarios;

CREATE POLICY "authenticated_access" ON usuarios
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON usuarios
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON usuarios
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- ALUNOS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select alunos" ON alunos;
DROP POLICY IF EXISTS "Allow authenticated to insert alunos" ON alunos;
DROP POLICY IF EXISTS "Allow admin to delete alunos" ON alunos;
DROP POLICY IF EXISTS "Allow admin or professor to insert alunos" ON alunos;
DROP POLICY IF EXISTS "Allow admin to insert alunos" ON alunos;
DROP POLICY IF EXISTS "Allow admin to update alunos" ON alunos;

CREATE POLICY "authenticated_access" ON alunos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON alunos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON alunos
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON alunos
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- CHAMADAS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select chamadas" ON chamadas;
DROP POLICY IF EXISTS "Allow authenticated to insert chamadas" ON chamadas;
DROP POLICY IF EXISTS "Allow authenticated to update chamadas" ON chamadas;
DROP POLICY IF EXISTS "Allow admin or professor to insert chamadas" ON chamadas;

CREATE POLICY "authenticated_access" ON chamadas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON chamadas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON chamadas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON chamadas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- REGISTROS_CHAMADA TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select registros_chamada" ON registros_chamada;
DROP POLICY IF EXISTS "Allow authenticated to insert registros_chamada" ON registros_chamada;
DROP POLICY IF EXISTS "Allow authenticated to update registros_chamada" ON registros_chamada;
DROP POLICY IF EXISTS "Allow admin or professor to insert registros_chamada" ON registros_chamada;

CREATE POLICY "authenticated_access" ON registros_chamada
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON registros_chamada
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON registros_chamada
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON registros_chamada
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- AVALIACOES TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select avaliacoes" ON avaliacoes;
DROP POLICY IF EXISTS "Allow professor to insert avaliacoes" ON avaliacoes;
DROP POLICY IF EXISTS "Allow admin or creator to update avaliacoes" ON avaliacoes;
DROP POLICY IF EXISTS "Allow admin or creator to delete avaliacoes" ON avaliacoes;

CREATE POLICY "authenticated_access" ON avaliacoes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON avaliacoes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON avaliacoes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON avaliacoes
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- NOTAS_AVALIACAO TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select notas_avaliacao" ON notas_avaliacao;
DROP POLICY IF EXISTS "Allow professor to insert notas_avaliacao" ON notas_avaliacao;
DROP POLICY IF EXISTS "Allow admin or recorder to update notas_avaliacao" ON notas_avaliacao;

CREATE POLICY "authenticated_access" ON notas_avaliacao
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON notas_avaliacao
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON notas_avaliacao
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON notas_avaliacao
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- JUSTIFICATIVAS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select justificativas" ON justificativas;
DROP POLICY IF EXISTS "Allow responsavel to insert justificativas" ON justificativas;
DROP POLICY IF EXISTS "Allow admin to update justificativas" ON justificativas;

CREATE POLICY "authenticated_access" ON justificativas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON justificativas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON justificativas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON justificativas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- AULAS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select aulas" ON aulas;
DROP POLICY IF EXISTS "Allow authenticated to insert aulas" ON aulas;
DROP POLICY IF EXISTS "Allow authenticated to update aulas" ON aulas;

CREATE POLICY "authenticated_access" ON aulas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON aulas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON aulas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON aulas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- RESPONSAVEIS TABLE
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select responsaveis" ON responsaveis;
DROP POLICY IF EXISTS "Allow authenticated to insert responsaveis" ON responsaveis;
DROP POLICY IF EXISTS "Allow authenticated to update responsaveis" ON responsaveis;

CREATE POLICY "authenticated_access" ON responsaveis
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_insert" ON responsaveis
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update" ON responsaveis
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_delete" ON responsaveis
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================
-- Additional tables - ensure open access
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated to select turmas" ON turmas;
DROP POLICY IF EXISTS "Allow authenticated to select disciplinas" ON disciplinas;
DROP POLICY IF EXISTS "Allow authenticated to select ano_letivo" ON ano_letivo;
DROP POLICY IF EXISTS "Allow authenticated to select escola" ON escola;
DROP POLICY IF EXISTS "Allow authenticated to select professores" ON professores;

-- Turmas
CREATE POLICY "authenticated_access" ON turmas
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON turmas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON turmas
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON turmas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Disciplinas
CREATE POLICY "authenticated_access" ON disciplinas
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON disciplinas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON disciplinas
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON disciplinas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Ano Letivo
CREATE POLICY "authenticated_access" ON ano_letivo
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON ano_letivo
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON ano_letivo
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON ano_letivo
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Escola
CREATE POLICY "authenticated_access" ON escola
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON escola
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON escola
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON escola
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Professores
CREATE POLICY "authenticated_access" ON professores
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON professores
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON professores
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON professores
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Responsaveis Alunos
CREATE POLICY "authenticated_access" ON responsaveis_alunos
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON responsaveis_alunos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON responsaveis_alunos
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON responsaveis_alunos
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Notas
CREATE POLICY "authenticated_access" ON notas
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON notas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON notas
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON notas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Justificativas Falta
CREATE POLICY "authenticated_access" ON justificativas_falta
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_insert" ON justificativas_falta
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_update" ON justificativas_falta
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_delete" ON justificativas_falta
  FOR DELETE USING (auth.uid() IS NOT NULL);
