import { test, expect } from '@playwright/test';

test.describe('Function 15: Verified Organizer Multi-Session Event Schedule Management System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Verified Organizer can access Event Schedules manager, add a multi-session schedule, and customer can view timetable on event page', async ({ page }) => {
    // 1. Initial Page Load and set Verified Organizer Auth Session in LocalStorage
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

    // 2. Navigate to Organizer Event Schedules Management Page
    await page.goto('/organizer/schedules');
    await expect(page.getByRole('heading', { name: /Multi-Session Event Schedule Manager/i })).toBeVisible({ timeout: 10000 });

    // 3. Verify Add Schedule Session Button exists
    const addSessionBtn = page.getByRole('button', { name: /Add Schedule Session/i });
    await expect(addSessionBtn).toBeVisible({ timeout: 10000 });

    // 4. Click Add Schedule Session
    await addSessionBtn.click();
    await expect(page.locator('text=Add New Schedule Session').first()).toBeVisible({ timeout: 10000 });

    // 5. Fill Schedule Form
    await page.fill('input[placeholder*="Opening Concert Keynote"]', 'Playwright E2E Keynote Session');
    await page.fill('input[placeholder*="Main Auditorium Stage A"]', 'Main Arena Stage 1');
    await page.fill('input[placeholder*="Mariens Band"]', 'Dr. Perera Lead Speaker');
    
    // Set Start Time and End Time
    const startTimeInput = page.locator('input[type="datetime-local"]').first();
    const endTimeInput = page.locator('input[type="datetime-local"]').last();
    await startTimeInput.fill('2026-09-01T09:00');
    await endTimeInput.fill('2026-09-01T12:00');

    // Submit Session Form
    const submitBtn = page.getByRole('button', { name: /Create Session/i });
    await submitBtn.click();

    // 6. Verify Toast Confirmation and Schedule Item rendering
    await expect(page.locator('text=New schedule session added').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Playwright E2E Keynote Session').first()).toBeVisible({ timeout: 10000 });

    // 7. Navigate to Customer Event Details Page to verify Event Schedule & Timetable display
    await page.goto('/event/6');
    await expect(page.locator('text=Event Schedule & Session Timetable').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Opening Ceremony').first()).toBeVisible({ timeout: 10000 });
  });

});
