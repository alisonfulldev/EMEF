# 🚀 Começar com Testes - Sistema EMEF

## Em 3 Passos

### 1️⃣ Rodar Testes Unitários

```bash
npm run test
```

Resultado esperado:
```
✓ 119 testes passando
Coverage: 89.85%
Duration: ~6s
```

### 2️⃣ Verificar Coverage

```bash
npm run test:coverage
```

Abre relatório em `coverage/index.html`

### 3️⃣ Rodar Testes E2E

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Rodar E2E
npm run test:e2e
```

---

## Comandos Principais

```bash
# Testes em tempo real
npm run test:watch

# Interface Visual
npm run test:ui

# E2E com navegador visível
npm run test:e2e:headed

# Todos os testes
npm run test:all
```

---

## 📚 Documentação

- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Guia Completo
- **[EXAMPLES_TEST.md](./EXAMPLES_TEST.md)** - Exemplos Práticos
- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Resumo
- **[CHECKLIST_TESTES.md](./CHECKLIST_TESTES.md)** - Checklist Detalhado
- **[TESTES_INSTALADOS.md](./TESTES_INSTALADOS.md)** - Lista de Arquivos

---

## 📊 Estatísticas

- **Testes Unitários:** 89 ✅
- **Testes Integração:** 30 ✅
- **Testes E2E:** 36+ ✅
- **Coverage:** 89.85% ✅
- **Arquivos de Teste:** 15 ✅

---

## ❓ Dúvidas Comuns

**P: Como adicionar um novo teste?**
R: Veja `EXAMPLES_TEST.md` - Exemplo 1 e 2

**P: Teste está falhando, como debugar?**
R: Execute `npm run test:watch` para modo interativo

**P: Como rodar teste específico?**
R: `npm run test -- --grep "nome do teste"`

**P: E2E não funciona?**
R: Certifique-se que `npm run dev` está rodando

---

## 🎯 Próximo Passo

Leia: **[TEST_GUIDE.md](./TEST_GUIDE.md)**

---

*Gerado: 31 de Março de 2024*
