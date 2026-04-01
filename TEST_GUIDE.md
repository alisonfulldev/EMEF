# Guia de Testes - Sistema EMEF

Documentação completa para rodar testes unitários, de integração e E2E no projeto.

## Índice

- [Instalação](#instalação)
- [Testes Unitários](#testes-unitários)
- [Testes de Integração](#testes-de-integração)
- [Testes E2E](#testes-e2e)
- [Coverage](#coverage)
- [CI/CD](#cicd)

## Instalação

As dependências de teste já foram instaladas. Para verificar:

```bash
npm list vitest @testing-library/react playwright msw
```

## Testes Unitários

### O que são testados

- Funções utilitárias (`src/lib/utils.ts`)
  - Formatação de datas
  - Cálculo de frequência
  - Validações de email e telefone
  - Operações com arrays
  - Geração de IDs

- Funções de validação (`src/lib/validate.ts`)
  - Validação de registro de chamada
  - Validação de notas
  - Validação de justificativas
  - Validação de alunos
  - Validação de turmas
  - Validação de aulas
  - Validação de avaliações
  - Validação de arquivos Excel

### Executar testes unitários

```bash
# Rodar todos os testes unitários
npm run test

# Rodar testes em modo watch (reexecuta quando arquivos mudam)
npm run test -- --watch

# Rodar testes de um arquivo específico
npm run test src/__tests__/unit/lib/utils.test.ts

# Rodar com pattern
npm run test -- --grep "formatDate"

# Rodar com cobertura
npm run test:coverage
```

### Estrutura de testes unitários

```
src/__tests__/
├── unit/
│   └── lib/
│       ├── utils.test.ts          # Testes de funções utilitárias
│       └── validate.test.ts       # Testes de validações
├── fixtures/                       # Dados de teste
│   ├── auth.fixtures.ts
│   ├── student.fixtures.ts
│   └── class.fixtures.ts
├── mocks/                          # Mocks e MSW
│   ├── handlers.ts
│   └── server.ts
├── helpers/                        # Utilitários de teste
│   └── test-utils.tsx
└── setup.ts                        # Configuração global
```

## Testes de Integração

### O que são testados

- APIs de Autenticação
  - Sign up
  - Login
  - Logout
  - Fetch user atual
  - Session management

- APIs de Alunos
  - GET /api/admin/alunos (listar)
  - GET /api/admin/alunos/:id (detalhe)
  - POST /api/admin/alunos (criar)
  - PATCH /api/admin/alunos/:id (atualizar)
  - DELETE /api/admin/alunos/:id (deletar)

- APIs de Turmas
  - GET /api/admin/turmas
  - GET /api/admin/turmas/:id
  - POST /api/admin/turmas
  - PATCH /api/admin/turmas/:id
  - DELETE /api/admin/turmas/:id
  - GET /api/admin/disciplinas

### Executar testes de integração

```bash
# Todos os testes de integração
npm run test src/__tests__/integration

# Teste específico
npm run test src/__tests__/integration/api/students.test.ts

# Com watch mode
npm run test src/__tests__/integration --watch

# Mockar APIs com MSW
# Os testes já vêm com handlers MSW configurados
```

### Mock de APIs com MSW

Os testes de integração usam MSW (Mock Service Worker) para mockar as APIs. Os handlers estão definidos em:

- `src/__tests__/mocks/handlers.ts` - Definem as respostas mocadas
- `src/__tests__/mocks/server.ts` - Setup do MSW

Para adicionar novo mock:

```typescript
// src/__tests__/mocks/handlers.ts
http.post(`${BASE_URL}/api/seu-endpoint`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json(
    { data: { ...body } },
    { status: 201 }
  );
}),
```

### Estrutura de testes de integração

```
src/__tests__/
├── integration/
│   └── api/
│       ├── auth.test.ts           # Testes de autenticação
│       ├── students.test.ts       # Testes de alunos
│       └── classes.test.ts        # Testes de turmas
```

## Testes E2E

### O que são testados

- Fluxo de Login
  - Login com credenciais válidas
  - Erro com credenciais inválidas
  - Validação de campos obrigatórios
  - Remember me

- Fluxo de Sign Up
  - Navegação para página de cadastro
  - Criação de nova conta
  - Validação de confirmação de senha

- Gerenciamento de Alunos (Admin)
  - Listar alunos
  - Buscar aluno
  - Ordenar alunos
  - Criar aluno
  - Editar aluno
  - Deletar aluno
  - Ver detalhes do aluno

- Registro de Chamada (Professor)
  - Acessar página de chamada
  - Selecionar turma e data
  - Marcar presença/ausência
  - Salvar registro
  - Ver histórico de chamadas
  - Exportar relatório

### Executar testes E2E

```bash
# Rodar todos os testes E2E
npm run test:e2e

# Rodar teste específico
npm run test:e2e e2e/tests/auth.e2e.spec.ts

# Modo headed (ver navegador)
npm run test:e2e -- --headed

# Modo debug
npm run test:e2e -- --debug

# Com video
npm run test:e2e -- --record-video=on

# Rodar em navegador específico
npm run test:e2e -- --project=chromium

# Gerar HTML report
npm run test:e2e -- --reporter=html

# Abrir último report
npx playwright show-report
```

### Configuração do Playwright

O arquivo `playwright.config.ts` contém:

```typescript
- Base URL: http://localhost:3000
- Navegadores: Chrome, Firefox, Safari
- Screenshots: Apenas em falhas
- Videos: Mantém em falhas
- Timeout: 30 segundos por teste
- Retry: 2 vezes em CI
```

### Estrutura de testes E2E

```
e2e/
├── tests/
│   ├── auth.e2e.spec.ts          # Testes de autenticação
│   ├── students.e2e.spec.ts      # Testes de gestão de alunos
│   └── attendance.e2e.spec.ts    # Testes de chamada
└── fixtures/                      # Dados para E2E
```

### Pré-requisitos para rodar E2E

```bash
# 1. Instalar browsers do Playwright
npx playwright install

# 2. Garantir que o servidor está rodando
npm run dev

# 3. Em outro terminal, rodar testes
npm run test:e2e
```

## Coverage

### Gerar relatório de cobertura

```bash
# Cobertura de testes unitários
npm run test:coverage

# Abre relatório em HTML
npm run test:coverage
# Abra: coverage/index.html

# Com thresholds (limiares)
# Configurado em vitest.config.ts:
# - Lines: 70%
# - Functions: 70%
# - Branches: 70%
# - Statements: 70%
```

### Interpretar o relatório

- Verde: Ótima cobertura (> 80%)
- Amarelo: Razoável (50-80%)
- Vermelho: Baixa cobertura (< 50%)

Melhorar cobertura:
1. Adicionar novos testes para linhas não cobertas
2. Testar edge cases
3. Testar tratamento de erros

## CI/CD

### GitHub Actions

Adicione ao seu `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - run: npm run test
      
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - run: npx playwright install
      
      - run: npm run build
      
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Dicas e Boas Práticas

### Unitários

```typescript
// Teste uma coisa por teste
it('should calculate frequency correctly', () => {
  expect(calculateFrequencia(20, 30)).toBe(67);
});

// Use descritivos claros
it('should reject email without @', () => {
  expect(validateEmail('invalid')).toBe(false);
});

// Teste casos extremos
it('should handle empty arrays', () => {
  expect(sortByName([])).toEqual([]);
});
```

### Integração

```typescript
// Use fixtures para dados consistentes
const response = await fetch(`${BASE_URL}/api/admin/alunos`, {
  method: 'POST',
  body: JSON.stringify(mockCreateStudentData),
});

// Verifique status e estrutura
expect(response.status).toBe(201);
expect(data).toHaveProperty('id');
expect(data).toHaveProperty('criado_em');
```

### E2E

```typescript
// Use seletores robustos
// Bom:
await page.fill('input[type="email"]', 'test@example.com');
await page.click('button[type="submit"]');

// Evitar:
await page.fill('input[name="input_1"]', 'test'); // frágil

// Sempre espere pelo elemento
await expect(page.locator('[role="alert"]')).toBeVisible();

// Use data-testid em componentes críticos
<input data-testid="student-name-input" />
```

## Troubleshooting

### Testes falhando no CI mas passando localmente

```bash
# Limpar cache
rm -rf node_modules .next
npm install
npm run build

# Verificar variáveis de ambiente
cat .env.test

# Rodar com mais detalhes
npm run test -- --reporter=verbose
```

### MSW não está respondendo

```bash
# Verificar se setup.ts está sendo carregado
npm run test -- --inspect-brk

# Verificar handlers
cat src/__tests__/mocks/handlers.ts
```

### Playwright não encontra elementos

```bash
# Rodar com headed mode para ver o navegador
npm run test:e2e -- --headed

# Usar inspect mode
npm run test:e2e -- --inspect

# Debug com pause
test.only('debug test', async ({ page }) => {
  await page.goto(url);
  await page.pause(); // Pausa a execução
});
```

### Timeout nos testes

```typescript
// Aumentar timeout para teste específico
it('should load slow page', async ({ page }) => {
  await page.goto(url, { waitUntil: 'networkidle' });
}, { timeout: 60000 });

// Ou configure globalmente em vitest.config.ts
testTimeout: 30000
```

## Próximas Melhorias

- [ ] Testes de componentes React com @testing-library/react
- [ ] Visual regression tests com Playwright
- [ ] Performance tests
- [ ] Teste de segurança (CSRF, XSS)
- [ ] Teste de acessibilidade
- [ ] Testes de otimização de imagens

## Recursos

- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [MSW Docs](https://mswjs.io/)
- [Testing Library Docs](https://testing-library.com/)

---

**Última atualização:** March 31, 2024
