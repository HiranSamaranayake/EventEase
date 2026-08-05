import { test, expect } from '@playwright/test';

test.describe('Function 14: Super Admin Database Backup Controls & Security Governance Policies', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Super Admin can generate real-time database backup snapshots, download SQL dumps, and configure security policies', async ({ page }) => {
    // 1. Initial Page Load and set Super Admin Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'super_admin'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Admin Settings Page
    await page.goto('/admin-settings');
    await expect(page.getByRole('heading', { name: /Admin Platform Settings & Security Policies/i })).toBeVisible({ timeout: 10000 });

    // 3. Verify Database Backup Controls Section
    await expect(page.locator('text=Database Backup Controls & Snapshots')).toBeVisible({ timeout: 10000 });
    const backupBtn = page.getByRole('button', { name: /Generate Database Backup Now/i });
    await expect(backupBtn).toBeVisible({ timeout: 10000 });

    // 4. Generate a Database Backup Snapshot
    await backupBtn.click();
    await expect(page.locator('text=snapshot generated successfully').first()).toBeVisible({ timeout: 10000 });

    // 5. Verify Backup Snapshot renders in History Table
    const downloadBtn = page.locator('a:has-text("Download .sql")').first();
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });

    // 6. Test Security Governance Policies Form
    await page.selectOption('#setting-max-login-attempts', '3');
    await page.selectOption('#setting-session-timeout', '30');

    const savePoliciesBtn = page.getByRole('button', { name: /Save Security Policies/i });
    await savePoliciesBtn.click();

    // 7. Verify Success Toast for Policy Update
    await expect(page.locator('text=Security policies and system configurations updated').first()).toBeVisible({ timeout: 10000 });
  });

});
