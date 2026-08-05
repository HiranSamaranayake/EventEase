import { test, expect } from '@playwright/test';

test.describe('Function 13: Security Admin Audit Logging & Fraud Detection Monitoring System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Security Admin can monitor security audit logs, filter threats by risk level, and flag suspicious activities', async ({ page }) => {
    // 1. Initial Page Load and set Security Admin Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'security_admin'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Security Audit Logs Dashboard
    await page.goto('/admin-security');
    await expect(page.getByRole('heading', { name: /Security Admin - Security Audit & Fraud Detection/i })).toBeVisible({ timeout: 10000 });

    // 3. Verify Threat Intelligence Metric Cards render
    await expect(page.locator('text=Total Security Logs')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Critical Threats')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=High Risk Events')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Flagged Suspicious')).toBeVisible({ timeout: 10000 });

    // 4. Verify security log table rows exist
    const logRows = page.locator('tbody tr');
    await expect(logRows.first()).toBeVisible({ timeout: 10000 });

    // 5. Test Filtering by Risk Level: High
    await page.selectOption('select:has(option[value="high"])', 'high');
    await expect(page.locator('text=HIGH').first()).toBeVisible({ timeout: 10000 });

    // Reset Filter to All
    await page.selectOption('select:has(option[value="all"])', 'all');
    await expect(logRows.first()).toBeVisible({ timeout: 10000 });

    // 6. Open Inspect & Act Modal for first security log item
    const inspectBtn = logRows.first().getByRole('button', { name: /Inspect & Act/i });
    await expect(inspectBtn).toBeVisible();
    await inspectBtn.click();

    // Verify Modal Details render
    await expect(page.locator('text=Event Description & Details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Adjust Risk Classification')).toBeVisible({ timeout: 10000 });

    // 7. Toggle Flag Status inside Modal
    const modalFlagBtn = page.locator('button:has-text("Flag")').last();
    await expect(modalFlagBtn).toBeVisible();
    await modalFlagBtn.click();

    // Verify Toast notification
    await expect(page.locator('text=flag status toggled').first()).toBeVisible({ timeout: 10000 });
  });

});
