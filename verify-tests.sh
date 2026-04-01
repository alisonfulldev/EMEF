#!/bin/bash

# Script para verificar se a suite de testes está corretamente configurada

echo "======================================"
echo "Verificação da Suite de Testes EMEF"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar arquivo
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# Função para verificar diretório
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# Função para verificar dependência
check_dependency() {
  if npm list "$1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

echo "1. Verificando Dependências..."
echo ""
check_dependency "vitest"
check_dependency "@testing-library/react"
check_dependency "@testing-library/jest-dom"
check_dependency "playwright"
check_dependency "msw"
check_dependency "@vitejs/plugin-react"
echo ""

echo "2. Verificando Arquivos de Configuração..."
echo ""
check_file "vitest.config.ts"
check_file "playwright.config.ts"
check_file ".env.test"
echo ""

echo "3. Verificando Estrutura de Testes..."
echo ""
check_dir "src/__tests__"
check_dir "src/__tests__/unit"
check_dir "src/__tests__/unit/lib"
check_dir "src/__tests__/integration"
check_dir "src/__tests__/integration/api"
check_dir "src/__tests__/fixtures"
check_dir "src/__tests__/mocks"
check_dir "src/__tests__/helpers"
check_dir "e2e/tests"
echo ""

echo "4. Verificando Arquivos de Teste..."
echo ""
check_file "src/__tests__/setup.ts"
check_file "src/__tests__/unit/lib/utils.test.ts"
check_file "src/__tests__/unit/lib/validate.test.ts"
check_file "src/__tests__/integration/api/auth.test.ts"
check_file "src/__tests__/integration/api/students.test.ts"
check_file "src/__tests__/integration/api/classes.test.ts"
check_file "e2e/tests/auth.e2e.spec.ts"
check_file "e2e/tests/students.e2e.spec.ts"
check_file "e2e/tests/attendance.e2e.spec.ts"
echo ""

echo "5. Verificando Fixtures..."
echo ""
check_file "src/__tests__/fixtures/auth.fixtures.ts"
check_file "src/__tests__/fixtures/student.fixtures.ts"
check_file "src/__tests__/fixtures/class.fixtures.ts"
echo ""

echo "6. Verificando Mocks..."
echo ""
check_file "src/__tests__/mocks/handlers.ts"
check_file "src/__tests__/mocks/server.ts"
echo ""

echo "7. Verificando Documentação..."
echo ""
check_file "TEST_GUIDE.md"
check_file "EXAMPLES_TEST.md"
check_file "TESTING_SUMMARY.md"
echo ""

echo "8. Verificando Scripts no package.json..."
echo ""
if grep -q '"test":' package.json; then
  echo -e "${GREEN}✓${NC} npm run test"
else
  echo -e "${RED}✗${NC} npm run test"
fi

if grep -q '"test:watch":' package.json; then
  echo -e "${GREEN}✓${NC} npm run test:watch"
else
  echo -e "${RED}✗${NC} npm run test:watch"
fi

if grep -q '"test:coverage":' package.json; then
  echo -e "${GREEN}✓${NC} npm run test:coverage"
else
  echo -e "${RED}✗${NC} npm run test:coverage"
fi

if grep -q '"test:e2e":' package.json; then
  echo -e "${GREEN}✓${NC} npm run test:e2e"
else
  echo -e "${RED}✗${NC} npm run test:e2e"
fi

echo ""
echo "======================================"
echo "Próximas Ações:"
echo "======================================"
echo ""
echo "1. Rodar testes unitários:"
echo "   ${YELLOW}npm run test${NC}"
echo ""
echo "2. Rodar com cobertura:"
echo "   ${YELLOW}npm run test:coverage${NC}"
echo ""
echo "3. Rodar em modo watch:"
echo "   ${YELLOW}npm run test:watch${NC}"
echo ""
echo "4. Rodar testes E2E:"
echo "   ${YELLOW}npm run test:e2e${NC}"
echo ""
echo "5. Ler a documentação:"
echo "   ${YELLOW}cat TEST_GUIDE.md${NC}"
echo ""
echo "======================================"
