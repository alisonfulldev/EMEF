// =====================================================
// TIPOS TYPESCRIPT - Sistema Escola
// =====================================================

// Enums
export type Perfil = 'professor' | 'responsavel' | 'admin' | 'secretaria' | 'diretor' | 'cozinha';
export type Turno = 'matutino' | 'vespertino' | 'noturno';
export type StatusChamada = 'iniciada' | 'concluida' | 'cancelada';
export type StatusRegistro = 'presença' | 'falta' | 'atraso' | 'justificada';
export type StatusJustificativa = 'pendente' | 'aprovada' | 'rejeitada';
export type TipoAvaliacao = 'prova' | 'trabalho' | 'participacao' | 'outro';

// =====================================================
// MODELS / DATABASE TYPES
// =====================================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  perfil: Perfil;
  ativo: boolean;
  foto_url?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Escola {
  id: string;
  nome: string;
  sigla?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  diretor_id?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface AnoLetivo {
  id: string;
  ano: number;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Turma {
  id: string;
  nome: string;
  turno: Turno;
  ano_letivo_id: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Aluno {
  id: string;
  nome_completo: string;
  data_nascimento?: string;
  numero_chamada: number;
  matricula: string;
  turma_id: string;
  foto_url?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Professor {
  id: string;
  usuario_id: string;
  especialidade?: string;
  formacao?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Responsavel {
  id: string;
  usuario_id: string;
  crm?: string;
  profissao?: string;
  telefone?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ResponsavelAluno {
  id: string;
  responsavel_id: string;
  aluno_id: string;
  grau_parentesco?: string;
  criado_em: string;
}

export interface Aula {
  id: string;
  turma_id: string;
  disciplina_id: string;
  professor_id: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  sala?: string;
  conteudo_planejado?: string;
  atividade_planejada?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Chamada {
  id: string;
  aula_id: string;
  turma_id: string;
  data: string;
  status: StatusChamada;
  iniciada_em: string;
  concluida_em?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface RegistroChamada {
  id: string;
  chamada_id: string;
  aluno_id: string;
  status: StatusRegistro;
  observacao?: string;
  motivo_alteracao?: string;
  horario_evento?: string;
  registrado_por: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Justificativa {
  id: string;
  aluno_id: string;
  data_falta: string;
  motivo: string;
  status: StatusJustificativa;
  enviado_por: string;
  aprovado_por?: string;
  aprovado_em?: string;
  observacao_aprovacao?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface JustificativaFalta {
  id: string;
  registro_chamada_id: string;
  justificativa_id: string;
  responsavel_id: string;
  criado_em: string;
}

export interface Avaliacao {
  id: string;
  turma_id: string;
  disciplina_id: string;
  aula_id?: string;
  titulo: string;
  tipo: TipoAvaliacao;
  data_aplicacao: string;
  data_entrega?: string;
  valor_maximo: number;
  descricao?: string;
  criado_por: string;
  criado_em: string;
  atualizado_em: string;
}

export interface NotaAvaliacao {
  id: string;
  avaliacao_id: string;
  aluno_id: string;
  nota?: number;
  observacao?: string;
  registrado_por: string;
  registrado_em: string;
  atualizado_em: string;
}

export interface Nota {
  id: string;
  aluno_id: string;
  disciplina_id: string;
  turma_id: string;
  ano_letivo_id: string;
  bimestre: number;
  nota: number;
  atualizado_em: string;
}

// =====================================================
// EXTENDED TYPES (com relacionamentos)
// =====================================================

export interface AlunoComDetalhes extends Aluno {
  turma?: Turma;
  responsaveis?: (Responsavel & { grau_parentesco: string })[];
  frequencia?: number;
  alertas?: string[];
}

export interface ChamadaComRegistros extends Chamada {
  aula?: Aula;
  registros?: RegistroChamada[];
  turma?: Turma;
}

export interface AvaliacaoComNotas extends Avaliacao {
  disciplina?: Disciplina;
  notas?: NotaAvaliacao[];
  turma?: Turma;
}

export interface JustificativaComDetalhes extends Justificativa {
  aluno?: Aluno;
  responsavel?: Responsavel;
  observacoes?: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateAlunoRequest {
  nome_completo: string;
  data_nascimento?: string;
  numero_chamada: number;
  matricula: string;
  turma_id: string;
  foto_url?: string;
}

export interface UpdateAlunoRequest extends Partial<CreateAlunoRequest> {
  id: string;
}

export interface CreateTurmaRequest {
  nome: string;
  turno: Turno;
  ano_letivo_id: string;
}

export interface CreateDisciplinaRequest {
  nome: string;
}

export interface CreateAulaRequest {
  turma_id: string;
  disciplina_id: string;
  professor_id: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  sala?: string;
  conteudo_planejado?: string;
  atividade_planejada?: string;
}

export interface CreateChamadaRequest {
  aula_id: string;
}

export interface RegistroChamadaRequest {
  chamada_id: string;
  aluno_id: string;
  status: StatusRegistro;
  observacao?: string;
}

export interface ConcluirChamadaRequest {
  chamada_id: string;
  registros: RegistroChamadaRequest[];
}

export interface CreateJustificativaRequest {
  aluno_id: string;
  data_falta: string;
  motivo: string;
}

export interface AprovarJustificativaRequest {
  justificativa_id: string;
  status: 'aprovada' | 'rejeitada';
  observacao_aprovacao?: string;
}

export interface CreateAvaliacaoRequest {
  turma_id: string;
  disciplina_id: string;
  titulo: string;
  tipo: TipoAvaliacao;
  data_aplicacao: string;
  data_entrega?: string;
  valor_maximo?: number;
  descricao?: string;
}

export interface RegistrarNotasRequest {
  avaliacao_id: string;
  notas: Array<{
    aluno_id: string;
    nota?: number;
    observacao?: string;
  }>;
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface DashboardStats {
  total_alunos: number;
  total_turmas: number;
  total_professores: number;
  alunos_com_alerta: number;
  justificativas_pendentes: number;
}

export interface AlertaFrequencia {
  aluno_id: string;
  aluno_nome: string;
  turma_nome: string;
  frequencia: number;
  total_faltas: number;
  total_aulas: number;
}

export interface ResumoFrequencia {
  aluno_id: string;
  aluno_nome: string;
  presencas: number;
  faltas: number;
  atrasos: number;
  justificadas: number;
  taxa_frequencia: number;
}

// =====================================================
// EXPORT TYPES
// =====================================================

export interface FrequenciaExport {
  matricula: string;
  nome_aluno: string;
  [key: string]: string | number; // data => presença/falta
}

export interface ConteudoExport {
  data: string;
  turma: string;
  disciplina: string;
  professor: string;
  conteudo: string;
  atividade: string;
}

export interface DiarioNarandiba {
  escola: string;
  data: string;
  turma: string;
  disciplina: string;
  professor: string;
  alunos: Array<{
    numero: number;
    nome: string;
    presenca: string;
    assinatura?: string;
  }>;
  conteudo: string;
  atividade: string;
  observacoes?: string;
}

// =====================================================
// AUTH TYPES
// =====================================================

export interface AuthSession {
  user: {
    id: string;
    email: string;
    usuario?: Usuario;
  } | null;
}

export interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
}

// =====================================================
// UI COMPONENT TYPES
// =====================================================

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface FormError {
  field: string;
  message: string;
}
