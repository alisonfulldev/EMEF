# ✅ Checklist de Deployment - Sistema Escola

## 🚀 Antes de Começar

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Git instalado (`git --version`)
- [ ] Conta Supabase criada (https://supabase.com)
- [ ] Conta Vercel criada (https://vercel.com)
- [ ] Repo GitHub criado e conectado

---

## 📋 Setup Local (10 min)

### Passo 1: Instalar
```bash
cd "c:\Users\Home\Desktop\Sistema EMEF"
npm install
```
- [ ] `npm install` completou sem erros

### Passo 2: Supabase
```
1. [ ] Criar novo projeto em https://app.supabase.com
2. [ ] Copiar NEXT_PUBLIC_SUPABASE_URL
3. [ ] Copiar NEXT_PUBLIC_SUPABASE_ANON_KEY
4. [ ] Copiar SUPABASE_SERVICE_ROLE_KEY
5. [ ] Abrir SQL Editor
6. [ ] Colar todo conteúdo de schema.sql
7. [ ] Executar (Run)
8. [ ] Aguardar conclusão
```

### Passo 3: .env.local
```bash
cp .env.example .env.local
```
Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<URL_COPIADA>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY_COPIADA>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_KEY_COPIADA>
```
- [ ] .env.local criado e preenchido

### Passo 4: GitHub OAuth (Opcional)
```
1. [ ] Ir https://github.com/settings/developers
2. [ ] "New OAuth App"
3. [ ] Application name: "Sistema Escola"
4. [ ] Homepage URL: http://localhost:3000
5. [ ] Authorization callback: http://localhost:3000/auth/callback
6. [ ] Criar
7. [ ] Copiar Client ID e Client Secret
8. [ ] Ir Supabase → Authentication → Providers → GitHub
9. [ ] Habilitar e colar Client ID e Client Secret
10. [ ] Salvar
```
- [ ] GitHub OAuth configurado (opcional)

---

## 🧪 Testes Locais (5 min)

### Passo 1: Rodar Dev Server
```bash
npm run dev
```
- [ ] Servidor rodando em http://localhost:3000

### Passo 2: Testar Login
```
1. [ ] Abrir http://localhost:3000
2. [ ] Clicar "Entrar com GitHub"
3. [ ] Fazer login com GitHub (ou usuário local se configurado)
4. [ ] Página deve redirecionar para /adm (admin) ou /professor
5. [ ] Dashboard deve aparecer
```
- [ ] Login funcionando

### Passo 3: Testar Navegação
```
1. [ ] Admin → Clique em "Alunos" (sidebar)
2. [ ] Deve aparecer tela de CRUD
3. [ ] Clique "Novo Aluno"
4. [ ] Modal deve abrir
5. [ ] Feche modal (não precisa salvar)
```
- [ ] Navegação funcionando

### Passo 4: Testar API
```bash
# Em outro terminal, rodar
curl http://localhost:3000/api/admin/turmas
```
- [ ] API retorna resposta JSON

---

## 🏗️ Build (2 min)

### Passo 1: Build Local
```bash
npm run build
```
- [ ] Build compilou sem erros
- [ ] Pasta `.next/` criada

### Passo 2: Start Produção
```bash
npm start
```
- [ ] Servidor rodou em http://localhost:3000
- [ ] Testes básicos funcionam

---

## 🌐 Deploy Vercel (5 min)

### Passo 1: Conectar GitHub
```
1. [ ] Push para GitHub: git push
2. [ ] Ir https://vercel.com/new
3. [ ] Selecionar seu repo
4. [ ] Vercel importa automaticamente
```

### Passo 2: Variáveis de Ambiente
```
1. [ ] Em Vercel → Settings → Environment Variables
2. [ ] Adicionar:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
3. [ ] Salvar
```
- [ ] Variáveis configuradas

### Passo 3: Deploy
```
1. [ ] Clicar "Deploy"
2. [ ] Aguardar build completar (2-3 min)
3. [ ] Clique na URL fornecida
4. [ ] Testar login e navegação
```
- [ ] Deploy completo
- [ ] Site acessível

### Passo 4: GitHub OAuth em Produção
```
1. [ ] Em GitHub → Settings → Developer settings → OAuth Apps
2. [ ] Clicar no app criado
3. [ ] Authorization callback URL → alterar para:
   https://seu-dominio-vercel.vercel.app/auth/callback
4. [ ] Salvar
5. [ ] Em Supabase → GitHub provider → atualizar callback URL
```
- [ ] OAuth callback URL atualizado

---

## 📱 Testes em Produção

- [ ] Login com GitHub funciona
- [ ] Dashboard aparece
- [ ] Sidebar aparece corretamente
- [ ] Temas (cores) estão OK
- [ ] Responsive em mobile
- [ ] Fetch de dados funciona
- [ ] API calls funcionam
- [ ] Notificações (toast) funcionam
- [ ] Modais funcionam
- [ ] Forms funcionam

---

## 🔒 Segurança - Verificar

- [ ] .env.local não está no Git (verificar .gitignore)
- [ ] Variáveis de ambiente só em Vercel, não no código
- [ ] SUPABASE_SERVICE_ROLE_KEY está seguro
- [ ] GitHub OAuth está habilitado
- [ ] RLS está ativo no Supabase (verificar tabelas)

---

## 📊 Performance

```bash
# Build size
npm run build
# Verificar .next/static/chunks/
# Deve ser < 200KB por arquivo

# PageSpeed Insights
# Ir https://pagespeed.web.dev/
# Colar seu domínio Vercel
```

- [ ] Lighthouse Score > 80
- [ ] Bundle size razoável

---

## 🎯 Dados Iniciais

Após deploy, criar dados:

```
1. [ ] Admin → Escola → Preencher dados
2. [ ] Admin → Ano Letivo → Criar 2024
3. [ ] Admin → Disciplinas → Adicionar (Português, Matemática, etc)
4. [ ] Admin → Turmas → Criar turmas
5. [ ] Admin → Alunos → Adicionar alunos
6. [ ] Admin → Usuários → Criar professor, responsável
```

---

## ✨ Extras (Opcional)

- [ ] Adicionar logo em `public/logo.png`
- [ ] Customizar cores em `tailwind.config.js`
- [ ] Adicionar favicon
- [ ] Setup backup automático Supabase
- [ ] Setup monitoring (Sentry, Vercel Analytics)
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Documentação customizada

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Erro ao conectar Supabase" | Verificar .env.local |
| "Página 404" | Verificar schema.sql executado |
| "GitHub login não funciona" | Verificar callback URL |
| "API retorna 401" | Verificar auth middleware |
| "Build falha" | `npm install` novamente |
| "Muito lento" | Verificar bundle size, otimizar imagens |

---

## ✅ Final

- [ ] Local funciona 100%
- [ ] Vercel deploy completo
- [ ] GitHub OAuth funciona
- [ ] Dados iniciais criados
- [ ] Testes em produção passaram
- [ ] Documentação lida
- [ ] Pronto para usar! 🎉

---

## 📞 Contacto

**Documentação:**
- README.md - Guia técnico
- INICIO_RAPIDO.md - Setup
- PROJETO_COMPLETO.md - Overview

**Stack:**
- Next.js 15
- Supabase (PostgreSQL)
- Vercel

---

**Tudo pronto? Bora usar! 🚀**
