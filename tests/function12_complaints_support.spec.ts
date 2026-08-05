import { test, expect } from '@playwright/test';

test.describe('Function 12: Junior Support Admin Complaints & Issue Handling System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJjc3QyMzAxNUBzdGQudXd1LmFjLmxrIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Customer can lodge a support ticket and Junior Support Admin can review, update, and resolve it', async ({ page }) => {
    const uniqueSubject = 'Ticket Refund Inquiry ' + Date.now();

    // 1. Initial Page Load and set Customer Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Ananjana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Customer Support Desk
    await page.goto('/customer/support');
    await expect(page.getByRole('heading', { name: /Support & Complaints Desk/i })).toBeVisible({ timeout: 10000 });

    // 3. Lodge a New Support Ticket
    const lodgeBtn = page.getByRole('button', { name: /Lodge New Ticket/i });
    await expect(lodgeBtn).toBeVisible();
    await lodgeBtn.click();

    // Fill Form
    await page.fill('input[placeholder*="e.g., Seat reservation issue"]', uniqueSubject);
    await page.selectOption('select:has(option[value="booking_issue"])', 'booking_issue');
    await page.selectOption('select:has(option[value="high"])', 'high');
    await page.fill('textarea[placeholder*="Explain what happened in detail"]', 'Payment was processed successfully but seat status requires manual sync.');

    const submitBtn = page.getByRole('button', { name: /Submit Support Ticket/i });
    await submitBtn.click();

    // 4. Verify Ticket renders in Customer Support Tickets list
    await expect(page.locator(`text=${uniqueSubject}`).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Open Ticket').first()).toBeVisible({ timeout: 10000 });

    // 5. Switch session to Junior Admin / Support Admin in LocalStorage
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'junior_admin'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 6. Navigate to Admin Complaints Management page
    await page.goto('/admin-complaints');
    await expect(page.getByRole('heading', { name: /Junior Support Admin - Complaints Desk/i })).toBeVisible({ timeout: 10000 });

    // 7. Verify submitted ticket appears in table
    const ticketRow = page.locator('tr').filter({ hasText: uniqueSubject });
    await expect(ticketRow.first()).toBeVisible({ timeout: 10000 });

    // 8. Open Respond & Manage modal
    const respondBtn = ticketRow.first().getByRole('button', { name: /Respond & Manage/i });
    await respondBtn.click();

    // Fill response details
    await expect(page.locator('text=Official Admin Resolution Response')).toBeVisible({ timeout: 10000 });
    await page.selectOption('#complaint-status-select', 'resolved');
    await page.fill('textarea[placeholder*="Provide resolution details"]', 'Support Team verified transaction and synced ticket status.');

    const saveBtn = page.getByRole('button', { name: /Save & Send Resolution/i });
    await saveBtn.click();

    // Wait for modal to close
    await expect(page.locator('text=Official Admin Resolution Response')).not.toBeVisible({ timeout: 10000 });

    // 9. Switch back to Customer and verify official resolution
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Ananjana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    await page.goto('/customer/support');
    await expect(page.locator(`text=${uniqueSubject}`).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Resolved').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Support Team verified transaction and synced ticket status.').first()).toBeVisible({ timeout: 10000 });
  });

});
