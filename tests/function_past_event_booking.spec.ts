import { test, expect } from '@playwright/test';

test.describe('Past Event Booking Prevention & Verification', () => {

  test.beforeAll(async ({ request }) => {
    await request.get('http://localhost/EventEase/backend/setup_past_events_test.php');
  });

  test('1. Future event allows ticket reservation (Book Ticket enabled)', async ({ page }) => {
    await page.goto('http://localhost:5173/event/889');
    await expect(page.locator('h1')).toContainText('Future Tech Summit 2026', { timeout: 15000 });

    const bookBtn = page.locator('a:has-text("Reserve Seats & Book Ticket")');
    await expect(bookBtn).toBeVisible({ timeout: 10000 });
  });

  test('2. Past event disables ticket reservation and displays Booking Closed / Event Ended notice', async ({ page }) => {
    await page.goto('http://localhost:5173/event/888');
    await expect(page.locator('h1')).toContainText('Past Test Musical Gala 2024', { timeout: 15000 });

    const disabledBtn = page.locator('button:has-text("Booking Closed")');
    await expect(disabledBtn).toBeVisible({ timeout: 10000 });
    await expect(disabledBtn).toBeDisabled();

    await expect(page.locator('text=Event Ended / Booking Closed')).toBeVisible();
    await expect(page.locator('text=ticket reservation is no longer available')).toBeVisible();
  });

  test('3. Explore Events page renders Booking Closed button and Event Ended badge on past event cards', async ({ page }) => {
    await page.goto('http://localhost:5173/events');
    await expect(page.locator('h1')).toContainText('Explore Events', { timeout: 15000 });

    const pastEventCard = page.locator('div.grid > div').filter({ hasText: 'Past Test Musical Gala 2024' });
    await expect(pastEventCard).toBeVisible({ timeout: 10000 });

    const endedBadge = pastEventCard.getByText('Event Ended').first();
    await expect(endedBadge).toBeVisible();

    const closedBtn = pastEventCard.getByRole('button', { name: 'Booking Closed' });
    await expect(closedBtn).toBeVisible();
    await expect(closedBtn).toBeDisabled();
  });

  test('4. Backend API strictly rejects booking for past events', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: 13,
        event_id: 888, // Past event
        ticket_quantity: 1
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeFalsy();
    expect(data.message).toContain('Booking Closed');
    expect(data.message).toContain('already passed');
  });

  test('5. Past event booking restriction is fully Mobile Responsive across Desktop (1280x800), Tablet (768x1024), and Mobile (375x667)', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/event/888');
    await expect(page.locator('text=Event Ended / Booking Closed')).toBeVisible({ timeout: 15000 });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=Event Ended / Booking Closed')).toBeVisible();

    // Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=Event Ended / Booking Closed')).toBeVisible();
  });

});
