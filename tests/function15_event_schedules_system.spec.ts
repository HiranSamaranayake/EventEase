import { test, expect } from '@playwright/test';

test.describe('Function 15: Verified Organizer Multi-Session Event Schedule Management System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Verified Organizer can access Event Schedules manager and add a multi-session schedule', async ({ page }) => {
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

    // 2. Navigate to Organizer Event Schedules Page
    await page.goto('/organizer/schedules');
    await expect(page.getByRole('heading', { name: /Multi-Session Event Schedule Manager/i })).toBeVisible({ timeout: 10000 });

    // Select Event #16
    const selectDropdown = page.locator('#select-event-schedule-dropdown');
    await expect(selectDropdown).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#select-event-schedule-dropdown option[value="16"]')).toBeAttached({ timeout: 10000 });
    await selectDropdown.selectOption('16');

    // 3. Verify Add Schedule Session button exists
    const addSessionBtn = page.getByRole('button', { name: /Add Schedule Session/i });
    await expect(addSessionBtn).toBeVisible({ timeout: 10000 });

    // 4. Click Add Schedule Session
    await addSessionBtn.click();
    await expect(page.locator('text=Add New Schedule Session').first()).toBeVisible({ timeout: 10000 });

    // 5. Fill Schedule Form
    const sessionTitle = 'Playwright Keynote Session ' + Math.floor(Math.random() * 1000);
    await page.fill('input[placeholder*="Opening Concert"]', sessionTitle);
    await page.fill('input[type="datetime-local"] >> nth=0', '2026-12-25T09:00');
    await page.fill('input[type="datetime-local"] >> nth=1', '2026-12-25T11:00');
    await page.fill('input[placeholder*="Main Auditorium"]', 'Grand Ballroom Alpha');
    await page.fill('input[placeholder*="Mariens Band"]', 'Prof. Samantha Perera');

    // Submit form
    const saveBtn = page.getByRole('button', { name: /Create Session/i });
    await saveBtn.click();

    // 6. Verify newly added session appears in schedule list
    await expect(page.locator(`text=${sessionTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

});
