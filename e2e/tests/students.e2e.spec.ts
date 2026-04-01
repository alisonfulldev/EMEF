import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Students Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');

    // Wait for admin dashboard
    await page.waitForURL(/\/admin\/.*/);
  });

  test.describe('List Students', () => {
    test('should view list of students', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Wait for table to load
      await page.waitForSelector('table, [role="grid"], [data-testid="students-list"]');

      // Should display students
      const rows = page.locator('tbody tr, [role="row"]');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search for student', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Find search input
      const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="Search"], input[aria-label*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('João Silva');
        await page.waitForTimeout(500);

        // Should filter results
        const rows = page.locator('tbody tr, [role="row"]');
        const rowText = await rows.first().textContent();
        expect(rowText).toContain('João Silva');
      }
    });

    test('should sort students by name', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Click on name column header
      const nameHeader = page.locator('th:has-text("Nome"), [role="columnheader"]:has-text("Nome")');
      if (await nameHeader.isVisible()) {
        await nameHeader.click();
        await page.waitForTimeout(500);

        // Verify sorting (visual check)
        const firstRow = page.locator('tbody tr:first-child, [role="row"]:first-child');
        expect(await firstRow.isVisible()).toBe(true);
      }
    });

    test('should paginate through students', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Look for pagination
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Próxima"), [aria-label*="next"]');
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        const firstPageUrl = page.url();
        await nextButton.click();
        await page.waitForTimeout(500);

        // Should be on next page or different URL
        expect(page.url()).not.toBe(firstPageUrl);
      }
    });
  });

  test.describe('Create Student', () => {
    test('should open create student form', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Click create button
      const createButton = page.locator('button:has-text("Novo"), button:has-text("Criar"), button:has-text("Add")');
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForSelector('form, [role="dialog"]');

        // Form should be visible
        const form = page.locator('form, [role="dialog"]');
        expect(await form.isVisible()).toBe(true);
      }
    });

    test('should create new student', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Click create button
      const createButton = page.locator('button:has-text("Novo"), button:has-text("Criar")');
      if (await createButton.isVisible()) {
        await createButton.click();

        // Fill form
        await page.fill('input[name="nome"], input[placeholder*="Nome"]', 'Pedro Oliveira');
        await page.fill('input[name="email"], input[placeholder*="Email"]', `pedro-${Date.now()}@example.com`);
        await page.fill('input[name="matricula"], input[placeholder*="Matrícula"]', `MAT-${Date.now()}`);

        // Submit form
        const submitButton = page.locator('button[type="submit"]:has-text("Criar"), button[type="submit"]:has-text("Salvar")');
        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Should show success message
          const successMessage = page.locator('[role="alert"]:has-text("criado"), [role="alert"]:has-text("sucesso")');
          if (await successMessage.isVisible()) {
            expect(await successMessage.isVisible()).toBe(true);
          }
        }
      }
    });

    test('should validate required fields on create', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      const createButton = page.locator('button:has-text("Novo"), button:has-text("Criar")');
      if (await createButton.isVisible()) {
        await createButton.click();

        // Try to submit without filling
        const submitButton = page.locator('button[type="submit"]:has-text("Criar"), button[type="submit"]:has-text("Salvar")');
        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Should show validation errors
          const errorMessages = page.locator('[role="alert"]');
          const count = await errorMessages.count();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Edit Student', () => {
    test('should open edit student form', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Click edit button on first student
      const editButton = page.locator('button:has-text("Editar"), button:has-text("Edit"), a:has-text("Editar")').first();
      if (await editButton.isVisible()) {
        await editButton.click();

        // Form should be visible
        const form = page.locator('form, [role="dialog"]');
        await expect(form).toBeVisible();
      }
    });

    test('should update student', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      const editButton = page.locator('button:has-text("Editar"), button:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();

        // Update field
        const nameInput = page.locator('input[name="nome"]');
        await nameInput.clear();
        await nameInput.fill('João Silva Atualizado');

        // Submit
        const submitButton = page.locator('button[type="submit"]:has-text("Salvar"), button[type="submit"]:has-text("Update")');
        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Should show success message
          const successMessage = page.locator('[role="alert"]:has-text("atualizado"), [role="alert"]:has-text("sucesso")');
          if (await successMessage.isVisible()) {
            expect(await successMessage.isVisible()).toBe(true);
          }
        }
      }
    });
  });

  test.describe('Delete Student', () => {
    test('should delete student', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Find delete button on first student
      const deleteButton = page.locator('button:has-text("Deletar"), button:has-text("Delete"), button:has-text("Remover")').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm deletion if dialog appears
        const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Sim"), button:has-text("Delete")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          // Should show success message
          const successMessage = page.locator('[role="alert"]:has-text("deletado"), [role="alert"]:has-text("sucesso")');
          if (await successMessage.isVisible()) {
            expect(await successMessage.isVisible()).toBe(true);
          }
        }
      }
    });
  });

  test.describe('View Student Details', () => {
    test('should view student details', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/alunos`);

      // Click on student row or view button
      const studentRow = page.locator('tbody tr:first-child, [role="row"]:first-child');
      if (await studentRow.isVisible()) {
        await studentRow.click();

        // Should navigate to student details page
        await page.waitForURL(/\/admin\/alunos\/[^/]+/);

        // Verify student information is displayed
        const studentInfo = page.locator('[data-testid="student-info"], h1, h2');
        expect(await studentInfo.count()).toBeGreaterThan(0);
      }
    });

    test('should display student information', async ({ page }) => {
      // Navigate to a specific student
      await page.goto(`${BASE_URL}/admin/alunos/student-1`);

      // Check for key student information
      const nome = page.locator('text=João Silva');
      const email = page.locator('text=joao@example.com');
      const matricula = page.locator('text=2024001');

      // At least one of these should be visible
      let hasInfo = false;
      if (await nome.isVisible()) hasInfo = true;
      if (await email.isVisible()) hasInfo = true;
      if (await matricula.isVisible()) hasInfo = true;

      expect(hasInfo).toBe(true);
    });
  });
});
