# SISTEMA ESCOLA - PROMPT COMPLETO E DETALHADO

## VISÃO GERAL COMPLETA

Sistema web full-stack de gestão escolar que implementa um "Diário Escolar de Narandiba" com funcionalidades completas para gerenciar escolas, turmas, alunos, professores, chamada/frequência, notas/avaliações e justificativas de falta.

### Perfis de Usuário

#### 1. PROFESSOR
- Visualizar turmas que leciona
- Registrar chamada/frequência das aulas
- Alterar registros de chamada (com motivo)
- Visualizar resumo de chamadas
- Criar avaliações/provas
- Registrar notas dos alunos
- Visualizar notas por turma
- Dashboard com estatísticas

#### 2. RESPONSÁVEL (Pais/Responsável Legal)
- Visualizar histórico do aluno
- Ver frequência/presença
- Ver notas e avaliações
- Enviar justificativas de falta
- Acompanhar status de justificativas
- Ver observações de aprovação/rejeição

#### 3. ADMIN/SECRETARIA
- Gerenciar escolas
- Gerenciar anos letivos
- Gerenciar usuários (criar, editar, deletar)
- Gerenciar alunos (CRUD completo)
- Gerenciar professores
- Gerenciar responsáveis
- Gerenciar turmas
- Gerenciar disciplinas
- Gerenciar aulas
- Visualizar e aprovar/rejeitar justificativas
- Visualizar alertas (alunos com baixa frequência)
- Visualizar notas e faltas
- Exportar relatórios (frequência, notas, conteúdo)
- Dashboard com estatísticas gerais
- Perfil de aluno (histórico completo)

---

## STACK TECNOLÓGICO COMPLETO

### Dependências Principais (package.json)
```json
{
  "dependencies": {
    "@supabase/ssr": "^0.9.0",
    "@supabase/supabase-js": "^2.99.2",
    "next": "15.1.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "5.9.3",
    "tailwindcss": "^3.4.1",
    "lucide-react": "^0.417.0",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.12.7",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "zustand": "^4.5.4",
    "xlsx": "^0.18.5",
    "web-push": "^3.6.7"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "15.1.5",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/web-push": "^3.6.4",
    "vitest": "^4.1.0",
    "@vitest/coverage-v8": "^4.1.0"
  }
}
```

### Tecnologias
- **Frontend**: Next.js 15.1.5 com App Router (React 19, TypeScript 5.9.3)
- **UI/Styling**: Tailwind CSS 3.4.1, Tailwind Merge, clsx
- **Icons**: Lucide React 0.417.0
- **Data Fetching**: Supabase SSR (@supabase/ssr, @supabase/supabase-js)
- **Autenticação**: Supabase Auth (GitHub OAuth)
- **Banco de Dados**: Supabase (PostgreSQL com RLS)
- **Estado Global**: Zustand 4.5.4
- **Datas**: date-fns 3.6.0
- **Gráficos**: Recharts 2.12.7
- **Notificações**: React Hot Toast 2.4.1
- **Excel**: XLSX 0.18.5
- **Push Notifications**: Web Push 3.6.7
- **Deploy**: Vercel
- **Versionamento**: Git + GitHub

---

## ESTRUTURA DE PASTAS COMPLETA

```
projeto/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Layout raiz
│   │   ├── page.tsx                            # Página inicial
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts                    # Callback do OAuth (GitHub)
│   │   │   └── login/
│   │   │       └── page.tsx                    # Página de login
│   │   │
│   │   ├── adm/                                # Dashboard Admin
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                        # Dashboard principal (alertas, stats)
│   │   │   ├── alunos/
│   │   │   │   └── [alunoId]/
│   │   │   │       └── page.tsx                # Perfil completo do aluno
│   │   │   ├── alertas/
│   │   │   │   └── page.tsx                    # Alunos com baixa frequência
│   │   │   ├── notas/
│   │   │   │   └── page.tsx                    # Visualizar notas
│   │   │   ├── justificativas/
│   │   │   │   └── page.tsx                    # Listar justificativas
│   │   │   └── avaliacoes/
│   │   │       └── [id]/
│   │   │           └── notas/
│   │   │               └── page.tsx            # Visualizar notas de avaliação
│   │   │
│   │   ├── admin/                              # Gestão de dados (CRUD)
│   │   │   ├── layout.tsx
│   │   │   ├── alunos/
│   │   │   │   └── page.tsx                    # CRUD Alunos
│   │   │   ├── turmas/
│   │   │   │   └── page.tsx                    # CRUD Turmas
│   │   │   ├── disciplinas/
│   │   │   │   └── page.tsx                    # CRUD Disciplinas
│   │   │   ├── professores/
│   │   │   │   └── page.tsx                    # CRUD Professores
│   │   │   ├── responsaveis/
│   │   │   │   └── page.tsx                    # CRUD Responsáveis
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx                    # CRUD Usuários
│   │   │   ├── escola/
│   │   │   │   └── page.tsx                    # Configurar escola
│   │   │   ├── ano-letivo/
│   │   │   │   └── page.tsx                    # CRUD Ano Letivo
│   │   │   ├── calendario/
│   │   │   │   └── page.tsx                    # Calendário escolar
│   │   │   └── aulas/
│   │   │       └── page.tsx                    # CRUD Aulas
│   │   │
│   │   ├── professor/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                        # Dashboard Professor
│   │   │   ├── chamada/
│   │   │   │   └── [aulaId]/
│   │   │   │       └── page.tsx                # Registrar chamada
│   │   │   ├── resumo/
│   │   │   │   └── [chamadaId]/
│   │   │   │       └── page.tsx                # Resumo de chamada
│   │   │   ├── notas/
│   │   │   │   └── page.tsx                    # Visualizar notas
│   │   │   ├── avaliacoes/
│   │   │   │   ├── page.tsx                    # Listar avaliações
│   │   │   │   └── [id]/
│   │   │   │       └── notas/
│   │   │   │           └── page.tsx            # Lançar notas
│   │   │
│   │   ├── responsavel/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                        # Dashboard Responsável
│   │   │   ├── justificativas/
│   │   │   │   └── page.tsx                    # Enviar justificativas
│   │   │   └── [alunoId]/
│   │   │       └── page.tsx                    # Histórico do aluno
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts                # Autenticação
│   │       ├── adm/
│   │       │   └── alunos/
│   │       │       ├── route.ts
│   │       │       └── [alunoId]/
│   │       │           └── route.ts
│   │       ├── professor/
│   │       │   ├── turmas/route.ts
│   │       │   ├── chamada/route.ts
│   │       │   ├── notas/route.ts
│   │       │   └── notas_bimestral/route.ts
│   │       ├── responsavel/
│   │       │   ├── alunos/route.ts
│   │       │   └── justificativas/route.ts
│   │       ├── avaliacoes/
│   │       │   ├── route.ts
│   │       │   └── [id]/notas/route.ts
│   │       ├── justificativas/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── export/
│   │           ├── frequencia/route.ts
│   │           ├── conteudo/route.ts
│   │           └── diario-narandiba/route.ts
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                       # Client-side
│   │   │   └── server.ts                       # Server-side
│   │   ├── utils.ts                            # Utilitários
│   │   └── validate.ts                         # Validações
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── [componentes específicos]
│   │
│   └── types/
│       └── index.ts
│
├── public/
│   └── [assets estáticos]
│
├── .env.example
├── .eslintrc.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## BANCO DE DADOS SUPABASE - SCHEMA COMPLETO

### Tabela: `usuarios`
```sql
id: UUID (PK, FK de auth.users)
email: VARCHAR (unique)
nome: VARCHAR
perfil: ENUM ('professor', 'responsavel', 'admin', 'secretaria', 'diretor')
ativo: BOOLEAN
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
foto_url: VARCHAR (nullable)
```

### Tabela: `escola`
```sql
id: UUID (PK)
nome: VARCHAR
sigla: VARCHAR
endereco: VARCHAR
cidade: VARCHAR
estado: VARCHAR
telefone: VARCHAR
email: VARCHAR
diretor_id: UUID (FK usuarios)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `ano_letivo`
```sql
id: UUID (PK)
ano: INTEGER
data_inicio: DATE
data_fim: DATE
ativo: BOOLEAN
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `turmas`
```sql
id: UUID (PK)
nome: VARCHAR (ex: "1ºA", "2ºB")
turno: ENUM ('matutino', 'vespertino', 'noturno')
ano_letivo_id: UUID (FK ano_letivo)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `disciplinas`
```sql
id: UUID (PK)
nome: VARCHAR (ex: "Português", "Matemática")
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `alunos`
```sql
id: UUID (PK)
nome_completo: VARCHAR
data_nascimento: DATE
numero_chamada: INTEGER
matricula: VARCHAR (unique)
turma_id: UUID (FK turmas)
foto_url: VARCHAR (nullable)
ativo: BOOLEAN
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `responsaveis`
```sql
id: UUID (PK, FK usuarios)
usuario_id: UUID (FK usuarios)
crm: VARCHAR (nullable)
profissao: VARCHAR
telefone: VARCHAR
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `responsaveis_alunos`
```sql
id: UUID (PK)
responsavel_id: UUID (FK responsaveis)
aluno_id: UUID (FK alunos)
grau_parentesco: VARCHAR (ex: "Pai", "Mãe", "Avó")
criado_em: TIMESTAMP
```

### Tabela: `professores`
```sql
id: UUID (PK, FK usuarios)
usuario_id: UUID (FK usuarios)
especialidade: VARCHAR
formacao: VARCHAR
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `aulas`
```sql
id: UUID (PK)
turma_id: UUID (FK turmas)
disciplina_id: UUID (FK disciplinas)
professor_id: UUID (FK usuarios/professores)
data: DATE
horario_inicio: TIME
horario_fim: TIME
sala: VARCHAR (ex: "Sala 101")
conteudo_planejado: TEXT (nullable)
atividade_planejada: TEXT (nullable)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `chamadas`
```sql
id: UUID (PK)
aula_id: UUID (FK aulas)
turma_id: UUID (FK turmas)
data: DATE
status: ENUM ('iniciada', 'concluida', 'cancelada')
iniciada_em: TIMESTAMP
concluida_em: TIMESTAMP (nullable)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `registros_chamada`
```sql
id: UUID (PK)
chamada_id: UUID (FK chamadas)
aluno_id: UUID (FK alunos)
status: ENUM ('presença', 'falta', 'atraso', 'justificada')
observacao: TEXT (nullable)
motivo_alteracao: VARCHAR (nullable)
horario_evento: TIME (nullable)
registrado_por: UUID (FK usuarios)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `justificativas`
```sql
id: UUID (PK)
aluno_id: UUID (FK alunos)
data_falta: DATE
motivo: VARCHAR
status: ENUM ('pendente', 'aprovada', 'rejeitada')
enviado_por: UUID (FK usuarios)
aprovado_por: UUID (FK usuarios, nullable)
aprovado_em: TIMESTAMP (nullable)
observacao_aprovacao: TEXT (nullable)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `justificativas_falta`
```sql
id: UUID (PK)
registro_chamada_id: UUID (FK registros_chamada)
justificativa_id: UUID (FK justificativas)
responsavel_id: UUID (FK responsaveis)
criado_em: TIMESTAMP
```

### Tabela: `avaliacoes`
```sql
id: UUID (PK)
turma_id: UUID (FK turmas)
disciplina_id: UUID (FK disciplinas)
aula_id: UUID (FK aulas)
titulo: VARCHAR (ex: "Prova Bimestral")
tipo: ENUM ('prova', 'trabalho', 'participacao', 'outro')
data_aplicacao: DATE
data_entrega: DATE (nullable)
valor_maximo: DECIMAL (default 10)
descricao: TEXT (nullable)
criado_por: UUID (FK usuarios)
criado_em: TIMESTAMP
atualizado_em: TIMESTAMP
```

### Tabela: `notas_avaliacao`
```sql
id: UUID (PK)
avaliacao_id: UUID (FK avaliacoes)
aluno_id: UUID (FK alunos)
nota: DECIMAL (nullable, 0-99.9)
observacao: TEXT (nullable)
registrado_por: UUID (FK usuarios)
registrado_em: TIMESTAMP
atualizado_em: TIMESTAMP
UNIQUE(avaliacao_id, aluno_id)
```

### Tabela: `notas`
```sql
id: UUID (PK)
aluno_id: UUID (FK alunos)
disciplina_id: UUID (FK disciplinas)
turma_id: UUID (FK turmas)
ano_letivo_id: UUID (FK ano_letivo)
bimestre: INTEGER (1-4)
nota: DECIMAL (0-10)
atualizado_em: TIMESTAMP
UNIQUE(aluno_id, disciplina_id, turma_id, ano_letivo_id, bimestre)
```

### RLS Policies (Row-Level Security)
```
- alunos: 
  - SELECT: professor (suas turmas), responsável (seus filhos), admin
  - UPDATE/DELETE: admin apenas

- usuarios:
  - SELECT: próprio ou admin
  - UPDATE: próprio ou admin
  - DELETE: admin apenas

- chamadas:
  - SELECT: professor (suas aulas), admin
  - INSERT/UPDATE: professor (suas aulas), admin

- registros_chamada:
  - SELECT: professor (suas aulas), responsável (seus filhos), admin
  - INSERT/UPDATE: professor (suas aulas), admin

- justificativas:
  - SELECT: responsável (suas), admin
  - INSERT: responsável
  - UPDATE: admin

- avaliacoes:
  - SELECT: professor (criador), admin
  - INSERT/UPDATE/DELETE: professor (criador)

- notas_avaliacao:
  - SELECT: professor (suas), admin, responsável (seus filhos)
  - INSERT/UPDATE: professor (suas)
```

---

## FUNCIONALIDADES DETALHADAS

### 1. FLUXO DE CHAMADA (PROFESSOR)
1. Professor acessa `/professor/chamada/[aulaId]`
2. Sistema carrega alunos da turma
3. Para cada aluno: presença, falta, atraso ou justificada
4. Adiciona observação individual (opcional)
5. Marca justificativa automaticamente se aprovada
6. Ao concluir, status da chamada muda para "concluida"
7. Acessa `/professor/resumo/[chamadaId]` para resumo
8. Pode alterar registros posteriores (com motivo)

### 2. FLUXO DE NOTAS (PROFESSOR)
1. Professor acessa `/professor/avaliacoes`
2. Lista avaliações (filtro por turma)
3. Cria nova avaliação (modal):
   - Título
   - Tipo (prova, trabalho, participação, outro)
   - Data de aplicação
   - Data de entrega
   - Valor máximo (default 10)
   - Descrição
4. Clica em avaliação → `/professor/avaliacoes/[id]/notas`
5. Tabela com alunos e inputs para notas
6. Salva notas (POST `/api/avaliacoes/[id]/notas`)
7. Sistema registra quem, quando e atualiza timestamp

### 3. FLUXO DE JUSTIFICATIVA (RESPONSÁVEL)
1. Responsável acessa `/responsavel/justificativas`
2. Vê lista de justificativas enviadas (com status)
3. Clica "Enviar Justificativa" (modal):
   - Seleciona aluno (filho)
   - Data da falta
   - Motivo
4. Sistema cria registro com status "pendente"
5. Admin visualiza em `/adm/justificativas`
6. Admin aprova/rejeita (com observação)
7. Responsável vê status atualizado

### 4. FLUXO DE APROVAÇÃO (ADMIN)
1. Admin acessa `/adm/justificativas`
2. Vê lista com filtros (Todas, Pendente, Aprovada, Rejeitada)
3. Expande linha para detalhes
4. Clica "Aprovar" ou "Rejeitar"
5. Se rejeitar: insere observação
6. Sistema registra quem aprovou, quando e observação
7. Quando aprovada, pode vincular a registros de falta

### 5. FLUXO DE ALERTAS (ADMIN)
1. Admin acessa `/adm/alertas` ou dashboard
2. Sistema calcula frequência por aluno
3. Mostra alunos com frequência < 75%
4. Filtros por turma, disciplina
5. Clica em aluno para histórico completo

### 6. FLUXO DE PERFIL DO ALUNO (ADMIN)
1. Admin acessa `/adm/alunos/[alunoId]`
2. Vê:
   - Dados pessoais (nome, matrícula, data nascimento, turma)
   - Foto
   - Responsáveis vinculados
   - Frequência geral (%)
   - Histórico de registros (últimas 30)
   - Notas por disciplina/bimestre
   - Justificativas
   - Alertas ativos

### 7. FLUXO DE EXPORTAÇÃO
1. Admin acessa `/api/export`
2. **Frequência**: grid alunos x datas (presença/falta)
3. **Conteúdo**: aulas com conteúdo e atividades
4. **Diário Narandiba**: tudo em formato específico
5. Retorna arquivo Excel para download

### 8. FLUXO DE GESTÃO (ADMIN)
**Alunos**: CRUD + vincular turma + responsáveis
**Turmas**: CRUD + adicionar alunos + ano letivo
**Disciplinas**: CRUD simples
**Professores**: CRUD + vinculação de aulas
**Responsáveis**: CRUD + vincular alunos
**Aulas**: CRUD + turma/disciplina/professor/horários
**Escola**: Dados principais
**Ano Letivo**: Criar períodos + marcar ativo
**Calendário**: Feriados, recessos, eventos

---

## CAMPOS DE FORMULÁRIOS

### Login
- Email/Usuário
- Botão "Entrar com GitHub"

### Criar Avaliação (Professor)
- [ ] Título (required)
- [ ] Tipo (dropdown)
- [ ] Data de Aplicação (date)
- [ ] Data de Entrega (date, optional)
- [ ] Valor Máximo (number, default 10)
- [ ] Descrição (textarea)
- Salvar / Cancelar

### Registrar Notas (Professor)
- Tabela: Número, Nome, Input Nota
- Validações: 0 <= nota <= valor_máximo
- Botão Salvar
- Toast success/error

### Enviar Justificativa (Responsável)
- [ ] Selecionar Aluno (dropdown, filhos)
- [ ] Data da Falta (date)
- [ ] Motivo (textarea)
- Enviar / Cancelar

### Registrar Chamada (Professor)
- Tabela: Número, Nome, Foto, Status Buttons
- Status: Presença, Falta, Atraso, Justificada
- Campo Observação por aluno
- Concluir Chamada
- Toast confirmação

### Aprovar Justificativa (Admin)
- Dados: Aluno, Data, Motivo
- Responsável
- Buttons: Aprovar, Rejeitar
- Se rejeitar: Observação (textarea)
- Toast sucesso

---

## VALIDAÇÕES E REGRAS DE NEGÓCIO

### Chamada
✓ Não pode registrar chamada para aula futura
✓ Chamada concluída não pode ser editada (apenas alterações)
✓ Alteração precisa de motivo
✓ Apenas professor da aula pode registrar

### Notas
✓ 0 <= nota <= valor_máximo
✓ Nota pode ser null
✓ Apenas professor de suas avaliações
✓ 1 nota por aluno (upsert)

### Justificativa
✓ Data não pode ser futura
✓ Motivo obrigatório
✓ Responsável só para seus filhos
✓ Status inicial: pendente
✓ Apenas admin aprova/rejeita

### Aluno
✓ Número chamada único por turma
✓ Matrícula única
✓ Vinculado a turma
✓ Tem responsáveis

### Turma
✓ Nome único por ano letivo
✓ 1 turma por aluno por ano

### Aula
✓ Turma + disciplina + professor
✓ horario_fim > horario_inicio

---

## AUTENTICAÇÃO E PERMISSÕES

### Login Flow
1. User clica "Entrar com GitHub"
2. Redireciona para GitHub OAuth
3. GitHub redireciona para `/auth/callback`
4. Supabase gerencia token
5. Sistema cria usuário se não existir
6. Redireciona baseado em perfil:
   - professor → `/professor`
   - responsavel → `/responsavel`
   - admin → `/adm`
   - secretaria → `/admin`

### Middleware de Proteção
- Todas as páginas/API verificam `auth.getUser()`
- Verificam perfil do usuário
- Retornam 401 se não autenticado
- Retornam 403 se sem permissão

---

## AMBIENTE E CONFIGURAÇÃO

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### TypeScript Config
- `strict: true`
- `moduleResolution: "bundler"`
- Path alias `@/*` = `./src/*`

### ESLint
- Rule disabled: `react/no-unescaped-entities`

### Next.js 15 Specifics
- App Router obrigatório
- `params` em rotas dinâmicas são Promises
- `cookies()` retorna Promise
- Client components: `useEffect` para resolver promises
- Server components: `await` direto

---

## FLUXOS DE DADOS

### Fetch de Dados (API)
```typescript
// Client Component
const [data, setData] = useState(null)
useEffect(() => {
  fetch('/api/endpoint?filters')
    .then(r => r.json())
    .then(d => setData(d))
}, [dependencies])
```

### Salvamento de Dados
```typescript
// POST / PATCH
const res = await fetch('/api/endpoint', {
  method: 'POST/PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
const result = await res.json()
if (res.ok) toast.success('Sucesso')
else toast.error(result.error)
```

---

## DEPLOY (VERCEL)

1. Push para GitHub main
2. Vercel detecta automaticamente
3. Executa build (next build)
4. Deploy automático se sucesso
5. URL: https://sistemescola.vercel.app

---

## PADRÕES E CONVENÇÕES

### Nomenclatura de Banco
- Tabelas: snake_case, plural (usuarios, chamadas)
- Colunas: snake_case
- FKs: `{tabela_singular}_id` (usuario_id, turma_id)
- Timestamps: `criado_em`, `atualizado_em`

### Variáveis de Estado React
- `const [data, setData] = useState(null)`
- `const [loading, setLoading] = useState(true)`
- `const [error, setError] = useState('')`
- `const [form, setForm] = useState({...})`

### Componentes
- Client components: `'use client'` no topo
- Server components: padrão
- Props tipadas com interfaces
- Destructuring nas props

### APIs
- GET: listar, filtrar
- POST: criar
- PATCH: atualizar parcial
- DELETE: remover
- Sempre retornar JSON
- Verificar auth e permissões

### Erros
- 401: Não autenticado
- 403: Sem permissão
- 400: Dados inválidos
- 404: Não encontrado
- 500: Erro interno
- Toast para feedback

---

## COMPONENTES E UI

### Cores
- Primary: blue-600 (Tailwind)
- Success: green-600
- Warning: amber-500
- Danger: red-600
- Neutral: slate/gray

### Componentes Comuns
- Buttons: azul principal, hover
- Inputs: border slate-300, focus:ring-blue
- Tables: striped, hover, responsive
- Modals: overlay escuro, form centralizado
- Dropdowns: select customizado
- Date Pickers: input date
- Notifications: toast (top-right)

### Ícones (Lucide React)
- Plus, Edit, Trash (CRUD)
- Check, X (ações)
- ChevronDown, ChevronUp (expandir)
- Calendar, Clock (datas/horas)
- Eye, EyeOff (mostrar/esconder)
- AlertCircle (alertas)
- User, Users (perfis)
- Download (exportar)

---

## ENDPOINTS API COMPLETOS

### Auth
- `GET/POST /api/auth/callback` - OAuth callback

### Alunos (Admin)
- `GET /api/adm/alunos` - Listar
- `POST /api/admin/alunos` - Criar
- `GET /api/adm/alunos/[alunoId]` - Detalhe
- `PATCH /api/admin/alunos/[alunoId]` - Editar
- `DELETE /api/admin/alunos/[alunoId]` - Deletar

### Chamadas (Professor)
- `GET /api/professor/turmas` - Minhas turmas
- `POST /api/professor/chamada` - Registrar
- `GET /api/adm/chamadas` - Listar (admin)

### Notas (Professor)
- `GET /api/professor/notas` - Minhas notas
- `POST /api/professor/notas_bimestral` - Salvar
- `GET /api/avaliacoes/[id]/notas` - Detalhes
- `POST /api/avaliacoes/[id]/notas` - Lançar
- `PATCH /api/avaliacoes/[id]/notas` - Editar

### Avaliações (Professor)
- `GET /api/professor/avaliacoes` - Minhas
- `POST /api/professor/avaliacoes` - Criar
- `PATCH /api/professor/avaliacoes/[id]` - Editar
- `DELETE /api/professor/avaliacoes/[id]` - Deletar

### Justificativas (Responsável)
- `GET /api/responsavel/justificativas` - Minhas
- `POST /api/responsavel/justificativas` - Enviar
- `GET /api/adm/justificativas` - Listar (admin)
- `PATCH /api/justificativas/[id]` - Aprovar/Rejeitar
- `DELETE /api/justificativas/[id]` - Deletar

### Alertas (Admin)
- `GET /api/adm/alertas` - Baixa frequência

### Exportação (Admin)
- `GET /api/export/frequencia` - Frequência (Excel)
- `GET /api/export/conteudo` - Conteúdo (Excel)
- `GET /api/export/diario-narandiba` - Diário (Excel)

### Admin (Gestão)
- `GET/POST /api/admin/turmas`
- `GET/POST /api/admin/disciplinas`
- `GET/POST /api/admin/professores`
- `GET/POST /api/admin/responsaveis`
- `GET/POST /api/admin/usuarios`
- `GET/PATCH /api/admin/escola`
- `GET/POST /api/admin/ano-letivo`
- `GET/POST /api/admin/calendario`
- `GET/POST /api/admin/aulas`

---

## INSTRUÇÕES PARA RECRIAÇÃO

Ao recriar em nova sessão:

1. **Crie a estrutura de pastas** conforme schema
2. **Instale dependências**: `npm install` com package.json
3. **Configure Supabase**: crie projeto, database, tabelas
4. **Configure Vercel**: link repo GitHub, add env vars
5. **Implemente rotas**: auth → admin → professor → responsável
6. **Teste RLS**: garanta que policies funcionam
7. **Build e deploy**: `npm run build` e deploy Vercel

---

**Este é o prompt COMPLETO e DETALHADO do Sistema Escola.**
