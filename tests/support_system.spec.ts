import { test, expect } from '@playwright/test';

const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDA0ODkwMDB9.dummysig';

test.describe('Function 2: Customer Support, Complaints & Dispute Resolution System', () => {

  test('Customer can navigate to Customer Support Center and view submission modal', async ({ page }) => {
    // Inject Customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/customer-support');

    // Verify support center header
    await expect(page.getByRole('heading', { name: 'Help & Customer Support Center' })).toBeVisible({ timeout: 10000 });

    // Open complaint submission modal
    const btn = page.getByRole('button', { name: 'Submit Support Complaint' });
    await expect(btn).toBeVisible();
    await btn.click();

    // Verify modal elements & category selector
    await expect(page.locator('text=Submit Support Complaint / Dispute')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('button:has-text("Submit Ticket")')).toBeVisible();
  });

  test('Admin can navigate to Support & Complaints Resolution Center', async ({ page }) => {
    // Inject Admin session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Super Admin',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'support_admin'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/admin-support');

    // Verify admin resolution center header
    await expect(page.getByRole('heading', { name: 'Customer Support & Dispute Resolution Center' })).toBeVisible({ timeout: 10000 });

    // Verify complaint counters
    await expect(page.locator('text=Open Complaints').first()).toBeVisible();
    await expect(page.locator('text=Payment Disputes').first()).toBeVisible();

    // Verify filter dropdowns
    await expect(page.locator('select').first()).toBeVisible();
  });

});
