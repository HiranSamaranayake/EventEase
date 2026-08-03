import { test, expect } from '@playwright/test';

test.describe('Function 2: User Authentication & Role-Based Access Control', () => {

  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User Verification';
  const testPhone = '0771234567';

  test('User Registration flow creates new user account', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    await page.locator('input[name="fullName"]').fill(testName);
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="phone"]').fill(testPhone);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.locator('input[name="confirmPassword"]').fill(testPassword);
    await page.locator('select[name="role"]').selectOption('customer');

    await page.locator('button[type="submit"]').click();

    // Verify notification toast or success indication
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
  });

  test('User Login flow with credentials authenticates and redirects by role', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);

    await page.locator('button[type="submit"]').click();

    // Verify token saved and redirected to customer dashboard
    await expect(page.locator('text=Login Successful')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/customer-dashboard', { timeout: 12000 });
  });

  test('User can view and update profile information', async ({ page }) => {
    const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDA0ODkwMDB9.dummysig';

    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        phone: '0771234567',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/profile');
    await expect(page.locator('text=Role: customer')).toBeVisible({ timeout: 10000 });
    const textInputs = page.locator('input[type="text"]');
    await expect(textInputs.first()).toBeVisible();

    // Update phone number input
    await textInputs.nth(1).fill('0719876543');

    await page.click('button:has-text("Save Profile Changes")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 10000 });
  });

});
