# 🧪 Testes - Sistema EMEF

Suite completa de testes unitários, integração e E2E.

## ⚡ Quick Start

```bash
# Rodar testes
npm run test

# Ver cobertura
npm run test:coverage

# Interface visual
npm run test:ui
```

## 📊 Status

- ✅ 119 testes passando
- ✅ 89.85% coverage
- ✅ 3 tipos de teste (unit, integration, e2e)
- ✅ Pronto para usar

## 📁 Arquivos

```
src/__tests__/unit/lib/
  ├── utils.test.ts (39 testes)
  └── validate.test.ts (50 testes)

src/__tests__/integration/api/
  ├── auth.test.ts (11 testes)
  ├── students.test.ts (9 testes)
  └── classes.test.ts (10 testes)

e2e/tests/
  ├── auth.e2e.spec.ts
  ├── students.e2e.spec.ts
  └── attendance.e2e.spec.ts
```

## 🚀 Comandos

### Testes

```bash
npm run test              # Todos
npm run test:watch       # Watch mode
npm run test:ui          # UI visual
npm run test:coverage    # Com coverage
npm run test:unit        # Apenas unitários
npm run test:integration # Apenas integração
```

### E2E

```bash
npm run test:e2e         # Headless
npm run test:e2e:headed  # Com navegador
npm run test:e2e:debug   # Debug
```

## 📚 Documentação

- **[START_TESTS.md](./START_TESTS.md)** - Comece aqui (3 passos)
- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Guia completo
- **[EXAMPLES_TEST.md](./EXAMPLES_TEST.md)** - Exemplos
- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Resumo

## 🧰 Ferramentas

- **Vitest** 4.1.0 - Testes unitários e integração
- **Playwright** 1.59.0 - Testes E2E
- **MSW** 2.12.14 - Mock de APIs
- **@testing-library** 16.3.2 - Testes React

## ❓ Dúvidas?

Veja [TEST_GUIDE.md](./TEST_GUIDE.md) seção Troubleshooting

---

**Status:** ✅ Pronto para uso
