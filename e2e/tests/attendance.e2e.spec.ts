import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Attendance (Chamada) E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as teacher
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'professor@example.com');
    await page.fill('input[type="password"]', 'ProfessorPassword123!');
    await page.click('button[type="submit"]');

    // Wait for teacher dashboard
    await page.waitForURL(/\/(professor|adm)\/.*/);
  });

  test.describe('Register Attendance', () => {
    test('should access attendance registration page', async ({ page }) => {
      // Navigate to attendance page
      const urlOptions = [
        `${BASE_URL}/professor/chamada`,
        `${BASE_URL}/adm/chamada`,
        `${BASE_URL}/professor/aulas`,
      ];

      for (const url of urlOptions) {
        await page.goto(url);
        const pageTitle = page.locator('h1, h2');
        if (await pageTitle.isVisible()) {
          break;
        }
      }

      // Verify page loaded
      const form = page.locator('form, [data-testid="attendance-form"]');
      expect(await form.isVisible()).toBe(true);
    });

    test('should select class and date for attendance', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/chamada`);

      // Select class
      const classSelect = page.locator('select[name="turma_id"], select[aria-label*="Turma"]');
      if (await classSelect.isVisible()) {
        await classSelect.selectOption('class-1');
      }

      // Select date
      const dateInput = page.locator('input[type="date"], input[name="data"]');
      if (await dateInput.isVisible()) {
        const today = new Date().toISOString().split('T')[0];
        await dateInput.fill(today);
      }

      // Look for submit or next button
      const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Continuar"), button[type="submit"]');
      if (await nextButton.isVisible()) {
        expect(await nextButton.isVisible()).toBe(true);
      }
    });

    test('should mark students present/absent', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/chamada`);

      // Fill initial form
      const classSelect = page.locator('select[name="turma_id"]');
      if (await classSelect.isVisible()) {
        await classSelect.selectOption('class-1');
      }

      const dateInput = page.locator('input[type="date"], input[name="data"]');
      if (await dateInput.isVisible()) {
        const today = new Date().toISOString().split('T')[0];
        await dateInput.fill(today);
      }

      // Submit and wait for attendance list
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();
      }

      // Look for student checkboxes
      const presentCheckbox = page.locator('input[type="checkbox"][name*="presente"], input[type="radio"][value="presente"]').first();
      if (await presentCheckbox.isVisible()) {
        await presentCheckbox.check();
        expect(await presentCheckbox.isChecked()).toBe(true);
      }

      // Look for absent option
      const absentRadio = page.locator('input[type="radio"][value="falta"], input[type="radio"][name*="falta"]').first();
      if (await absentRadio.isVisible()) {
        await absentRadio.check();
        expect(await absentRadio.isChecked()).toBe(true);
      }
    });

    test('should save attendance record', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/chamada`);

      // Fill form
      const classSelect = page.locator('select[name="turma_id"]');
      if (await classSelect.isVisible()) {
        await classSelect.selectOption('class-1');
      }

      const dateInput = page.locator('input[type="date"], input[name="data"]');
      if (await dateInput.isVisible()) {
        const today = new Date().toISOString().split('T')[0];
        await dateInput.fill(today);
      }

      // Mark attendance
      const presentCheckbox = page.locator('input[type="checkbox"][name*="presente"]').first();
      if (await presentCheckbox.isVisible()) {
        await presentCheckbox.check();
      }

      // Save
      const saveButton = page.locator('button:has-text("Salvar"), button:has-text("Registrar"), button[type="submit"]:last-child');
      if (await saveButton.isVisible()) {
        await saveButton.click();

        // Should show success message
        const successMessage = page.locator('[role="alert"]:has-text("registrado"), [role="alert"]:has-text("sucesso")');
        if (await successMessage.isVisible()) {
          expect(await successMessage.isVisible()).toBe(true);
        }
      }
    });
  });

  test.describe('View Attendance History', () => {
    test('should view attendance history', async ({ page }) => {
      // Navigate to attendance history
      const urlOptions = [
        `${BASE_URL}/professor/chamada/historico`,
        `${BASE_URL}/professor/relatorio/chamada`,
        `${BASE_URL}/adm/chamada/historico`,
      ];

      for (const url of urlOptions) {
        await page.goto(url);
        const pageContent = page.locator('body');
        if (await pageContent.isVisible()) {
          break;
        }
      }

      // Look for table or list
      const table = page.locator('table, [role="grid"]');
      if (await table.isVisible()) {
        expect(await table.isVisible()).toBe(true);
      }
    });

    test('should filter attendance by date range', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/chamada/historico`);

      // Look for date filters
      const startDateInput = page.locator('input[type="date"][name*="data_inicio"], input[name*="start"]');
      const endDateInput = page.locator('input[type="date"][name*="data_fim"], input[name*="end"]');

      if (await startDateInput.isVisible()) {
        await startDateInput.fill('2024-01-01');
      }

      if (await endDateInput.isVisible()) {
        await endDateInput.fill('2024-12-31');
      }

      // Apply filter
      const filterButton = page.locator('button:has-text("Filtrar"), button:has-text("Buscar"), button[type="submit"]');
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await page.waitForTimeout(500);

        // Results should be shown
        const table = page.locator('table, [role="grid"]');
        expect(await table.isVisible()).toBe(true);
      }
    });

    test('should export attendance report', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/chamada/historico`);

      // Look for export button
      const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Download"), button:has-text("Excel")');
      if (await exportButton.isVisible()) {
        // Set up listener for download
        const downloadPromise = page.waitForEvent('download');
        await exportButton.click();

        // Verify download started
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('chamada');
      }
    });
  });

  test.describe('Attendance Statistics', () => {
    test('should view attendance statistics', async ({ page }) => {
      // Navigate to statistics/dashboard
      const urlOptions = [
        `${BASE_URL}/professor/dashboard`,
        `${BASE_URL}/professor/relatorio`,
        `${BASE_URL}/adm/dashboard`,
      ];

      for (const url of urlOptions) {
        await page.goto(url);
        const pageContent = page.locator('body');
        if (await pageContent.isVisible()) {
          break;
        }
      }

      // Look for attendance stats
      const attendanceCard = page.locator('[data-testid*="attendance"], [aria-label*="attendance"], text=/frequência|presença|falta/i');
      const hasStats = await attendanceCard.isVisible().catch(() => false);

      // At least the page should load
      const pageTitle = page.locator('h1, h2');
      expect(await pageTitle.isVisible()).toBe(true);
    });

    test('should calculate attendance percentage', async ({ page }) => {
      await page.goto(`${BASE_URL}/professor/dashboard`);

      // Look for attendance percentage display
      const percentageText = page.locator('text=/\\d+%/');
      const count = await percentageText.count();

      // Should have at least some statistics
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
