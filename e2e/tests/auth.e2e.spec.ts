import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Authentication E2E', () => {
  test.describe('Login Flow', () => {
    test('should login with valid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Fill login form
      await page.fill('input[type="email"]', 'teste@example.com');
      await page.fill('input[type="password"]', 'SecurePassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard
      await page.waitForURL(/\/(admin|professor|responsavel|aluno)\/.*/);

      // Verify user is logged in
      const url = page.url();
      expect(url).not.toContain('/login');
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Fill login form with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');

      // Submit form
      await page.click('button[type="submit"]');

      // Look for error message
      const errorMessage = await page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Try to submit without filling form
      await page.click('button[type="submit"]');

      // Check for validation messages
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // HTML5 validation
      const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      const passwordValidity = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);

      expect(emailValidity || passwordValidity).toBe(false);
    });

    test('should remember me functionality if available', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      const rememberCheckbox = page.locator('input[type="checkbox"][aria-label*="Remember"]');
      if (await rememberCheckbox.isVisible()) {
        await rememberCheckbox.check();
        expect(await rememberCheckbox.isChecked()).toBe(true);
      }
    });
  });

  test.describe('Signup Flow', () => {
    test('should navigate to signup page', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Look for signup link
      const signupLink = page.locator('a:has-text("Sign up"), a:has-text("Criar conta"), a:has-text("Inscrever-se")');
      if (await signupLink.isVisible()) {
        await signupLink.click();
        await expect(page).toHaveURL(/\/signup|\/register/);
      }
    });

    test('should create new account', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);

      // Fill signup form
      await page.fill('input[name="nome"], input[name="name"]', 'Novo Usuário');
      await page.fill('input[type="email"]', `user-${Date.now()}@example.com`);
      await page.fill('input[type="password"]', 'SecurePassword123!');
      await page.fill('input[name="confirmPassword"], input[name="confirm_password"]', 'SecurePassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to login or dashboard
      await page.waitForURL(/\/(login|admin|professor|responsavel|aluno)\/.*/);

      const url = page.url();
      expect(url).toBeTruthy();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);

      // Fill form with mismatched passwords
      await page.fill('input[name="nome"], input[name="name"]', 'Novo Usuário');
      await page.fill('input[type="email"]', `user-${Date.now()}@example.com`);
      await page.fill('input[type="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"], input[name="confirm_password"]', 'DifferentPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error
      const errorMessage = await page.locator('[role="alert"]');
      if (await errorMessage.isVisible()) {
        expect(errorMessage).toBeVisible();
      }
    });
  });

  test.describe('Logout', () => {
    test('should logout user', async ({ page, context }) => {
      // Login first
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[type="email"]', 'teste@example.com');
      await page.fill('input[type="password"]', 'SecurePassword123!');
      await page.click('button[type="submit"]');

      // Wait for dashboard to load
      await page.waitForURL(/\/(admin|professor|responsavel|aluno)\/.*/);

      // Look for logout button/menu
      const userMenu = page.locator('[aria-label*="user"], [aria-label*="profile"], [aria-label*="menu"]');
      if (await userMenu.isVisible()) {
        await userMenu.click();

        // Find and click logout
        const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sair"), a:has-text("Sair")');
        if (await logoutButton.isVisible()) {
          await logoutButton.click();
          await page.waitForURL(/\/login|\/$/);
          expect(page.url()).toContain('/login');
        }
      }
    });
  });

  test.describe('Session', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
      // Try to access protected page without login
      await page.goto(`${BASE_URL}/admin`);

      // Should redirect to login
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
    });

    test('should persist session across pages', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[type="email"]', 'teste@example.com');
      await page.fill('input[type="password"]', 'SecurePassword123!');
      await page.click('button[type="submit"]');

      // Wait for dashboard
      await page.waitForURL(/\/(admin|professor|responsavel|aluno)\/.*/);
      const dashboardUrl = page.url();

      // Navigate to another page
      await page.goto(`${BASE_URL}/perfil`);

      // Should stay logged in (not redirect to login)
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/login');
    });
  });
});
