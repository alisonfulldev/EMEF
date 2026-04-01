# Exemplos de Testes - Sistema EMEF

Guia prático com exemplos de como adicionar mais testes.

## Exemplo 1: Teste Unitário de Uma Nova Função

### Função a testar

```typescript
// src/lib/attendance.ts
export function calculateMediaPresencas(
  registros: AttendanceRecord[]
): number {
  if (registros.length === 0) return 0;
  const presente = registros.filter(r => r.presente).length;
  return Math.round((presente / registros.length) * 100);
}
```

### Teste correspondente

```typescript
// src/__tests__/unit/lib/attendance.test.ts
import { describe, it, expect } from 'vitest';
import { calculateMediaPresencas } from '@/lib/attendance';

describe('Attendance - calculateMediaPresencas', () => {
  it('should return 0 for empty array', () => {
    expect(calculateMediaPresencas([])).toBe(0);
  });

  it('should calculate percentage correctly', () => {
    const registros = [
      { presente: true },
      { presente: true },
      { presente: false },
    ] as any;
    
    expect(calculateMediaPresencas(registros)).toBe(67);
  });

  it('should return 100 when all present', () => {
    const registros = [
      { presente: true },
      { presente: true },
      { presente: true },
    ] as any;
    
    expect(calculateMediaPresencas(registros)).toBe(100);
  });

  it('should return 0 when all absent', () => {
    const registros = [
      { presente: false },
      { presente: false },
    ] as any;
    
    expect(calculateMediaPresencas(registros)).toBe(0);
  });
});
```

## Exemplo 2: Teste de Integração de Uma Rota API

### Sua rota Next.js

```typescript
// src/app/api/admin/relatorios/frequencia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { turma_id, data_inicio, data_fim } = await request.json();

  // Validação
  if (!turma_id || !data_inicio || !data_fim) {
    return NextResponse.json(
      { error: 'Campos obrigatórios não preenchidos' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('chamadas')
      .select('*')
      .eq('turma_id', turma_id)
      .gte('data', data_inicio)
      .lte('data', data_fim);

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}
```

### Teste de integração

```typescript
// src/__tests__/integration/api/relatorios.test.ts
import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Relatório API', () => {
  describe('POST /api/admin/relatorios/frequencia', () => {
    it('should generate frequency report', async () => {
      const payload = {
        turma_id: 'class-1',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
      };

      const response = await fetch(
        `${BASE_URL}/api/admin/relatorios/frequencia`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return 400 for missing fields', async () => {
      const payload = {
        turma_id: 'class-1',
        // faltam data_inicio e data_fim
      };

      const response = await fetch(
        `${BASE_URL}/api/admin/relatorios/frequencia`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should validate date range', async () => {
      const payload = {
        turma_id: 'class-1',
        data_inicio: '2024-12-31',
        data_fim: '2024-01-01', // fim antes do início
      };

      const response = await fetch(
        `${BASE_URL}/api/admin/relatorios/frequencia`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      expect([400, 422]).toContain(response.status);
    });
  });
});
```

### Adicionar mock ao MSW

```typescript
// src/__tests__/mocks/handlers.ts - Adicionar ao array handlers:
http.post(`${BASE_URL}/api/admin/relatorios/frequencia`, async ({ request }) => {
  const body = await request.json();

  // Validar
  if (!body.turma_id || !body.data_inicio || !body.data_fim) {
    return HttpResponse.json(
      { error: 'Campos obrigatórios não preenchidos' },
      { status: 400 }
    );
  }

  // Retornar mock data
  return HttpResponse.json(
    {
      data: [
        { id: '1', aluno: 'João Silva', presenca: 85 },
        { id: '2', aluno: 'Maria Santos', presenca: 92 },
      ],
    },
    { status: 200 }
  );
}),
```

## Exemplo 3: Teste E2E de Um Fluxo Completo

### Fluxo: Gerar relatório de frequência (Admin)

```typescript
// e2e/tests/reports.e2e.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Relatório de Frequência', () => {
  test.beforeEach(async ({ page }) => {
    // Login como admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/.*/);
  });

  test('should generate frequency report', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/relatorios`);

    // Selecionar tipo de relatório
    const reportTypeSelect = page.locator('select[name="tipo_relatorio"]');
    if (await reportTypeSelect.isVisible()) {
      await reportTypeSelect.selectOption('frequencia');
    }

    // Selecionar turma
    const classSelect = page.locator('select[name="turma_id"]');
    if (await classSelect.isVisible()) {
      await classSelect.selectOption('class-1');
    }

    // Selecionar período
    const startDate = page.locator('input[name="data_inicio"]');
    const endDate = page.locator('input[name="data_fim"]');

    if (await startDate.isVisible()) {
      await startDate.fill('2024-01-01');
    }
    if (await endDate.isVisible()) {
      await endDate.fill('2024-12-31');
    }

    // Gerar relatório
    const generateButton = page.locator('button:has-text("Gerar"), button[type="submit"]');
    await generateButton.click();

    // Esperar resultado
    const report = page.locator('[data-testid="report-content"], table');
    await expect(report).toBeVisible();

    // Verificar dados
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should export report as Excel', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/relatorios`);

    // Gerar relatório (similar ao teste anterior)
    const reportTypeSelect = page.locator('select[name="tipo_relatorio"]');
    await reportTypeSelect.selectOption('frequencia');

    const classSelect = page.locator('select[name="turma_id"]');
    await classSelect.selectOption('class-1');

    const startDate = page.locator('input[name="data_inicio"]');
    await startDate.fill('2024-01-01');

    const endDate = page.locator('input[name="data_fim"]');
    await endDate.fill('2024-12-31');

    const generateButton = page.locator('button[type="submit"]');
    await generateButton.click();

    // Esperar relatório carregar
    await page.waitForSelector('[data-testid="report-content"], table');

    // Exportar
    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Download")');
    if (await exportButton.isVisible()) {
      await exportButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/frequencia.*\.xlsx$/);
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/relatorios`);

    // Tentar gerar sem selecionar turma
    const generateButton = page.locator('button[type="submit"]');
    const isDisabled = await generateButton.isDisabled();

    // Ou deve mostrar erro
    if (!isDisabled) {
      await generateButton.click();
      const error = page.locator('[role="alert"]');
      await expect(error).toBeVisible();
    }
  });
});
```

## Exemplo 4: Teste de Componente React

### Componente

```tsx
// src/components/StudentCard.tsx
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StudentCard({
  student,
  onEdit,
  onDelete,
}: StudentCardProps) {
  return (
    <div className="card">
      <h3>{student.nome}</h3>
      <p>{student.email}</p>
      <p>Matrícula: {student.matricula}</p>
      <div className="actions">
        <button onClick={() => onEdit(student.id)}>Editar</button>
        <button onClick={() => onDelete(student.id)}>Deletar</button>
      </div>
    </div>
  );
}
```

### Teste

```typescript
// src/__tests__/unit/components/StudentCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/helpers/test-utils';
import { StudentCard } from '@/components/StudentCard';
import { mockStudent } from '@/__tests__/fixtures/student.fixtures';

describe('StudentCard Component', () => {
  it('should render student information', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <StudentCard
        student={mockStudent}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText(mockStudent.nome)).toBeInTheDocument();
    expect(screen.getByText(mockStudent.email)).toBeInTheDocument();
    expect(screen.getByText(`Matrícula: ${mockStudent.matricula}`)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <StudentCard
        student={mockStudent}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButton = screen.getByText('Editar');
    editButton.click();

    expect(onEdit).toHaveBeenCalledWith(mockStudent.id);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <StudentCard
        student={mockStudent}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByText('Deletar');
    deleteButton.click();

    expect(onDelete).toHaveBeenCalledWith(mockStudent.id);
  });
});
```

## Exemplo 5: Fixture Personalizada

### Criar fixture para seus testes

```typescript
// src/__tests__/fixtures/grade.fixtures.ts
import { GradeRecord } from '@/types';

export const mockGrade: GradeRecord = {
  id: 'grade-1',
  aluno_id: 'student-1',
  disciplina_id: 'subject-1',
  bimestre: 1,
  valor: 8.5,
  tipo: 'prova',
  data: new Date().toISOString(),
};

export const mockGradesBimestre1 = [
  {
    ...mockGrade,
    id: 'grade-1',
    valor: 8.5,
  },
  {
    ...mockGrade,
    id: 'grade-2',
    valor: 7.0,
  },
  {
    ...mockGrade,
    id: 'grade-3',
    valor: 9.0,
  },
];

export function createMockGrade(overrides: Partial<GradeRecord> = {}) {
  return {
    ...mockGrade,
    ...overrides,
  };
}

// Usar:
const grade = createMockGrade({ valor: 10 });
const grades = mockGradesBimestre1;
```

## Exemplo 6: Mock Customizado com MSW

### Simular erro na API

```typescript
// src/__tests__/mocks/handlers.ts
import { HttpResponse } from 'msw';

// Adicionar ao array handlers:

// Simular erro 500
http.get(`${BASE_URL}/api/admin/alunos/error-500`, () => {
  return HttpResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  );
}),

// Simular timeout
http.get(`${BASE_URL}/api/admin/alunos/timeout`, async () => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return HttpResponse.json({ data: [] });
}),

// Simular erro de validação
http.post(`${BASE_URL}/api/admin/alunos`, async ({ request }) => {
  const body = await request.json() as any;

  if (!body.nome || body.nome.length < 5) {
    return HttpResponse.json(
      {
        error: 'Validação falhou',
        errors: {
          nome: ['Nome deve ter pelo menos 5 caracteres'],
        },
      },
      { status: 422 }
    );
  }

  return HttpResponse.json({ data: { id: '1', ...body } }, { status: 201 });
}),
```

## Checklist: Adicionando Um Novo Teste

- [ ] Identifique o tipo de teste (unitário, integração, E2E)
- [ ] Crie fixtures se necessário
- [ ] Adicione mocks ao MSW se for integração
- [ ] Escreva o teste com describe/it
- [ ] Use nomes descritivos
- [ ] Teste casos positivos e negativos
- [ ] Execute o teste: `npm run test`
- [ ] Verifique coverage: `npm run test:coverage`
- [ ] Atualize fixtures se precisar
- [ ] Commit com mensagem clara

## Comandos Úteis

```bash
# Rodar teste específico
npm run test src/__tests__/unit/lib/validate.test.ts

# Rodar com pattern
npm run test -- --grep "should validate email"

# Watch mode
npm run test -- --watch

# Modo UI
npm run test:ui

# Coverage
npm run test:coverage

# E2E
npm run test:e2e -- --headed

# Todos os testes
npm run test:all
```
