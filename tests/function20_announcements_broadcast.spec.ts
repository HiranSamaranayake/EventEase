import { test, expect } from '@playwright/test';

test.describe('Function 20: Verified Organizer Event Announcement & Attendee Broadcast System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Verified Organizer can compose urgent announcement alert and broadcast real notifications to event attendees', async ({ page }) => {
    // 1. Initial Page Load and set Organizer Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        full_name: 'Tech Events Asia',
        email: 'organizer@tech.com',
        role: 'organizer'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Organizer Broadcast Announcement Center Page
    await page.goto('/organizer/announcements');
    await expect(page.getByRole('heading', { name: /Event Announcement & Attendee Broadcast Hub/i })).toBeVisible({ timeout: 10000 });

    // Select Event #16 (Mariens Live in concert)
    const selectDropdown = page.locator('#select-event-broadcast-dropdown');
    await expect(selectDropdown).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#select-event-broadcast-dropdown option[value="16"]')).toBeAttached({ timeout: 10000 });
    await selectDropdown.selectOption('16');

    // 3. Verify Broadcast New Announcement button exists
    const broadcastBtn = page.locator('#broadcast-new-announcement-btn');
    await expect(broadcastBtn).toBeVisible({ timeout: 10000 });

    // 4. Click Broadcast New Announcement Modal
    await broadcastBtn.click();
    await expect(page.locator('text=Compose & Dispatch Broadcast Alert').first()).toBeVisible({ timeout: 10000 });

    // 5. Click Quick Preset Template (Gate Entry Advisory)
    const presetBtn = page.locator('button:has-text("Gate Entry Advisory")');
    await expect(presetBtn).toBeVisible({ timeout: 10000 });
    await presetBtn.click();

    // 6. Append unique Title ID
    const alertTitle = 'Gate Entry Advisory ' + Math.floor(Math.random() * 1000);
    await page.fill('input[placeholder*="URGENT"]', alertTitle);

    // Submit broadcast dispatch
    const sendBtn = page.getByRole('button', { name: /Dispatch Broadcast Now/i });
    await sendBtn.click();

    // 7. Verify Broadcast Delivery Audit Report Modal appears
    await expect(page.locator('text=Broadcast Delivery Audit Report').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=100% DISPATCH SUCCESS').first()).toBeVisible({ timeout: 10000 });

    // Close Audit Report Modal
    const closeAuditBtn = page.getByRole('button', { name: /Close Audit Report/i });
    await closeAuditBtn.click();

    // 8. Verify newly dispatched announcement renders in timeline feed
    await expect(page.locator(`text=${alertTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

});
