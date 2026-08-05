import { test, expect } from '@playwright/test';

test.describe('Function 17: Financial Admin Revenue Ledger & Organizer Payouts System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Financial Admin can audit gross revenue, platform commission, review payout requests, and process bank transfer approval', async ({ page }) => {
    // 1. Initial Page Load and set Financial Admin Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Financial Admin',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'financial_admin'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Admin Financial Payouts & Ledger Page
    await page.goto('/admin-financials');
    await expect(page.locator('text=Financial Admin - Revenue Ledger & Payouts Hub').first()).toBeVisible({ timeout: 10000 });

    // 3. Verify Financial KPI Summary Cards render
    await expect(page.locator('text=Gross Ticket Sales').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Platform Commission (10%)').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Pending Organizer Transfers').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Settled Payout Transfers').first()).toBeVisible({ timeout: 10000 });

    // 4. Verify Export Financial CSV Ledger button exists
    const exportBtn = page.locator('a:has-text("Export Financial CSV Ledger")').first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });

    // 5. Locate Process Payout button and click
    const processBtn = page.locator('button:has-text("Process Payout")').first();
    await expect(processBtn).toBeVisible({ timeout: 10000 });
    await processBtn.click();

    // 6. Verify Process Payout Modal opens
    await expect(page.locator('text=Process Organizer Payout').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Net Payable Amount:').first()).toBeVisible({ timeout: 10000 });

    // 7. Select Status 'TRANSFERRED' or 'APPROVED'
    const statusSelect = page.locator('#payout-status-select');
    await expect(statusSelect).toBeVisible({ timeout: 10000 });
    await statusSelect.selectOption('transferred');

    // Fill notes
    await page.fill('textarea[placeholder*="transaction reference ID"]', 'Automated Playwright E2E Settlement Verification #99812');

    // 8. Submit Payout Confirmation
    const saveBtn = page.getByRole('button', { name: /Save & Confirm Payout/i });
    await saveBtn.click();

    // 9. Verify Toast notification or status badge update
    await expect(page.locator('text=updated to TRANSFERRED').first()).toBeVisible({ timeout: 10000 });
  });

});
