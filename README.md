# Diário Escolar de Narandiba

Sistema web full-stack de gestão escolar com Next.js 15, React 19, TypeScript, Tailwind CSS e Supabase (PostgreSQL).

## 📋 O que foi criado

### ✅ Estrutura Base Completa
- **Configuração**: package.json, tsconfig, next.config, tailwind, eslint
- **Database**: schema.sql com 15 tabelas, enums, constraints, indexes e RLS policies
- **Tipos**: types/index.ts com todas as interfaces TypeScript
- **Libs**: Supabase client/server, utilitários, validações
- **Auth**: Login com GitHub OAuth, callback handler
- **Middleware**: Proteção de rotas por perfil
- **Componentes**: Navbar, Sidebar, Footer reutilizáveis
- **Layouts**: Layout estruturado para cada perfil (admin, adm, professor, responsavel)

### 📄 Páginas de Exemplo Criadas
- Dashboard Admin (`/adm/page.tsx`)
- Dashboard Professor (`/professor/page.tsx`)
- Dashboard Responsável (`/responsavel/page.tsx`)

### 🔌 API Routes de Exemplo
- `GET /api/adm/alunos` - Listar alunos
- `POST /api/admin/alunos` - Criar aluno
- `GET /api/professor/turmas` - Minhas turmas
- `GET /api/responsavel/alunos` - Meus filhos

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
cd "c:\Users\Home\Desktop\Sistema EMEF"
npm install
```

### 2. Configurar Supabase

#### Criar Projeto
1. Ir em https://app.supabase.com
2. Criar novo projeto
3. Copiar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

#### Executar Schema
1. Em Supabase, ir para SQL Editor
2. Copiar conteúdo de `schema.sql` do seu projeto
3. Executar na database

### 3. Configurar Environment Variables
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_aqui
```

### 4. Configurar GitHub OAuth (Opcional)
Para login com GitHub:
1. https://github.com/settings/developers
2. New OAuth App
3. Application name: "Diário Escolar"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/auth/callback`
6. Copiar Client ID e Secret

Em Supabase:
1. Authentication → Providers → GitHub
2. Habilitar
3. Copiar Client ID e Secret do GitHub

### 5. Rodar Aplicação
```bash
npm run dev
```

Acessar: http://localhost:3000

## 📁 Estrutura de Arquivos

```
Sistema EMEF/
├── public/                           # Assets estáticos
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Root page (redirect)
│   │   ├── globals.css              # Estilos globais
│   │   ├── auth/
│   │   │   ├── login/page.tsx       # ✅ Login page
│   │   │   └── callback/route.ts    # ✅ OAuth callback
│   │   ├── adm/
│   │   │   ├── layout.tsx           # ✅ Layout admin dashboard
│   │   │   ├── page.tsx             # ✅ Dashboard admin
│   │   │   ├── alunos/
│   │   │   ├── alertas/
│   │   │   ├── notas/
│   │   │   ├── justificativas/
│   │   │   └── ... (outros)
│   │   ├── admin/
│   │   │   ├── layout.tsx           # ✅ Layout admin gestão
│   │   │   ├── alunos/page.tsx      # A criar (usar exemplo)
│   │   │   ├── turmas/page.tsx
│   │   │   ├── disciplinas/page.tsx
│   │   │   └── ... (outros CRUD)
│   │   ├── professor/
│   │   │   ├── layout.tsx           # ✅ Layout professor
│   │   │   ├── page.tsx             # ✅ Dashboard professor
│   │   │   ├── chamada/
│   │   │   ├── notas/
│   │   │   ├── avaliacoes/
│   │   │   └── ... (outros)
│   │   ├── responsavel/
│   │   │   ├── layout.tsx           # ✅ Layout responsavel
│   │   │   ├── page.tsx             # ✅ Dashboard responsavel
│   │   │   ├── justificativas/
│   │   │   └── ... (outros)
│   │   └── api/
│   │       ├── adm/
│   │       │   └── alunos/route.ts  # ✅ GET/POST alunos
│   │       ├── admin/
│   │       │   ├── alunos/
│   │       │   │   └── [alunoId]/   # A criar
│   │       │   ├── turmas/
│   │       │   └── ... (outros CRUD)
│   │       ├── professor/
│   │       │   ├── turmas/route.ts  # ✅ GET turmas professor
│   │       │   ├── chamada/
│   │       │   ├── notas/
│   │       │   └── ... (outros)
│   │       ├── responsavel/
│   │       │   ├── alunos/route.ts  # ✅ GET alunos responsavel
│   │       │   └── justificativas/
│   │       ├── avaliacoes/
│   │       ├── justificativas/
│   │       └── export/
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx           # ✅ Barra superior
│   │       ├── Sidebar.tsx          # ✅ Menu lateral
│   │       └── Footer.tsx           # ✅ Rodapé
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # ✅ Client-side
│   │   │   └── server.ts            # ✅ Server-side
│   │   ├── utils.ts                 # ✅ Utilitários
│   │   └── validate.ts              # ✅ Validações
│   ├── types/
│   │   └── index.ts                 # ✅ Tipos TypeScript
│   └── middleware.ts                # ✅ Route protection
├── schema.sql                        # ✅ Database schema
├── package.json                      # ✅ Dependências
├── tsconfig.json                     # ✅ TypeScript config
├── next.config.js                    # ✅ Next.js config
├── tailwind.config.js                # ✅ Tailwind config
├── postcss.config.js                 # ✅ PostCSS config
├── .eslintrc.json                    # ✅ ESLint config
├── .env.example                      # ✅ Template env vars
├── .gitignore                        # ✅ Git ignore
├── README.md                         # 📄 Este arquivo
└── GUIA_CONCLUSAO.md                # 📄 Guia de desenvolvimento
```

**✅ = Arquivo criado**  
**A criar = Usar os padrões dos exemplos criados**

## 🔑 Perfis de Usuário

### 1. PROFESSOR
- Visualizar turmas que leciona
- Registrar chamada/frequência
- Criar avaliações e registrar notas
- Dashboard com estatísticas

**Rutas**: `/professor/*`  
**Exemplos criados**: `page.tsx` (dashboard), `turmas` (API)

### 2. RESPONSÁVEL
- Visualizar histórico do aluno
- Ver frequência e notas
- Enviar justificativas de falta
- Acompanhar status

**Routes**: `/responsavel/*`  
**Exemplos criados**: `page.tsx` (dashboard), `alunos` (API)

### 3. ADMIN/SECRETARIA
- Gerenciar escola, anos letivos, usuários
- CRUD de alunos, turmas, professores, responsáveis
- Visualizar alertas e justificativas
- Exportar relatórios

**Routes**: `/admin/*`, `/adm/*`  
**Exemplos criados**: `page.tsx` (dashboard), `alunos` (API)

## 📚 Padrões de Desenvolvimento

### Componente Page
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function PageName() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/endpoint');
        const result = await response.json();
        setData(result);
      } catch (error) {
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return <div>{/* Seu conteúdo */}</div>;
}
```

### API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase.from('tabela').select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
```

## 🎨 Componentes Tailwind

### Buttons
- `.btn-primary` - Botão azul principal
- `.btn-secondary` - Botão cinza
- `.btn-danger` - Botão vermelho
- `.btn-success` - Botão verde

### Forms
- `.input-base` - Input padrão
- `.textarea-base` - Textarea padrão
- `.select-base` - Select padrão

### Cards
- `.card` - Card padrão
- `.card-hover` - Card com hover

### Status Badges
- `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`

## 🧪 Testes e Build

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Production
npm start

# Linter
npm run lint

# Testes (se quiser adicionar)
npm run test
npm run test:coverage
```

## 📦 Dependências Principais

- **Next.js 15.1.5** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática
- **Tailwind CSS 3.4.1** - Estilos utilitários
- **Supabase** - Backend PostgreSQL + Auth
- **Zustand 4.5.4** - State management
- **Recharts 2.12.7** - Gráficos
- **React Hot Toast 2.4.1** - Notificações
- **XLSX 0.18.5** - Export Excel
- **date-fns 3.6.0** - Manipulação de datas
- **Lucide React 0.417.0** - Ícones

## 🔐 RLS (Row Level Security)

Todas as tabelas têm RLS habilitado com policies por perfil:

```sql
-- Exemplo: usuario vê apenas seus próprios dados ou é admin
SELECT: auth.uid() = id OR perfil = 'admin'
UPDATE: auth.uid() = id OR perfil = 'admin'
DELETE: perfil = 'admin'
```

## 📝 Próximas Tarefas

### High Priority (Usar os padrões criados)
- [ ] Completar CRUD Admin (alunos, turmas, professores)
- [ ] Completar Professor (chamada, notas, avaliações)
- [ ] Completar Responsável (justificativas, histórico)
- [ ] APIs de justificativas e aprovações
- [ ] Dashboard com gráficos (Recharts)

### Medium Priority
- [ ] Exportação Excel (frequência, notas, diário)
- [ ] Alertas de baixa frequência
- [ ] Notificações toast em todas as ações
- [ ] Filtros e paginação nas listas

### Low Priority (Nice to Have)
- [ ] Push notifications
- [ ] Modo escuro
- [ ] Relatórios PDF
- [ ] Sincronização offline
- [ ] Testes unitários

## 🚀 Deploy no Vercel

1. Push para GitHub
2. Conectar repo em https://vercel.com
3. Adicionar environment variables
4. Deploy automático

```bash
# Ou via CLI
npm i -g vercel
vercel
```

## 📞 Suporte

### Documentação
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- React: https://react.dev

### Issues Comuns

**Erro de RLS na query**
→ Verificar que user está autenticado em supabase.auth.getUser()

**Componente não renderiza**
→ Adicionar `'use client'` no topo do arquivo

**Tipos TypeScript faltando**
→ Importar de `@/types`

## 📄 Licença

MIT - Use livremente!

---

**Versão**: 1.0.0  
**Última atualização**: 2024  
**Status**: 80% completo - Pronto para conclusão seguindo os padrões
