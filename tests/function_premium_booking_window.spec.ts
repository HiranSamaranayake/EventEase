import { test, expect } from '@playwright/test';

test.describe('Premium vs Standard Customer Booking Opening Date & Ticket Control System', () => {

  test.beforeAll(async ({ request }) => {
    await request.get('http://localhost/EventEase/backend/setup_premium_window_test.php');
  });

  test('1. Organizer CANNOT create event if Normal booking date is less than 24 hours after Premium booking date', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Organizer User',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('http://localhost:5173/organizer/create-event');
    await expect(page.getByRole('heading', { name: 'Create Event' })).toBeVisible({ timeout: 15000 });

    // Fill event details
    await page.locator('input[placeholder*="University Tech Symposium"]').fill('Invalid Date Gap Event');
    await page.locator('textarea[placeholder*="Provide a compelling description"]').fill('Test event description');
    await page.locator('input[type="date"]').first().fill('2026-12-25');
    await page.locator('input[placeholder*="University Main Auditorium"]').fill('Colombo City Hall');

    // Select Premium booking date and invalid Normal booking date (same date)
    const premDateInput = page.locator('input[type="datetime-local"]').first();
    const normDateInput = page.locator('input[type="datetime-local"]').nth(1);

    await premDateInput.fill('2026-12-01T10:00');
    await normDateInput.fill('2026-12-01T10:00'); // Violates 24-hour gap rule

    // Click submit button
    const submitBtn = page.locator('button:has-text("Create Event")');
    await submitBtn.click();

    // Verify event creation is BLOCKED and error message is displayed
    const errorBanner = page.locator('text=Normal booking must open at least 24 hours after Premium booking');
    await expect(errorBanner).toBeVisible({ timeout: 10000 });
  });

  test('1b. Organizer CAN create event with valid date gap or auto-calculated default dates', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Organizer User',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('http://localhost:5173/organizer/create-event');
    await expect(page.getByRole('heading', { name: 'Create Event' })).toBeVisible({ timeout: 15000 });

    // Fill event details
    await page.locator('input[placeholder*="University Tech Symposium"]').fill('Valid Auto Date Event 2026');
    await page.locator('textarea[placeholder*="Provide a compelling description"]').fill('Test event with valid default dates auto-calculated');
    await page.locator('input[type="date"]').first().fill('2026-12-25');
    await page.locator('input[placeholder*="University Main Auditorium"]').fill('Colombo City Hall');
    await page.locator('input[placeholder*="e.g. 2000"]').fill('1500');

    // Click submit button
    const submitBtn = page.locator('button:has-text("Create Event")');
    await submitBtn.click();

    // Verify event is created successfully
    const successBanner = page.locator('text=Event is Created Successfully');
    await expect(successBanner).toBeVisible({ timeout: 10000 });
  });

  test('2. Phase 1 (Before Premium Date): Standard and Premium customers can view event details, but Book Ticket button is DISABLED', async ({ page }) => {
    await page.goto('http://localhost:5173/event/901');
    await expect(page.locator('h1:has-text("Phase 1 Future Festival 2026")')).toBeVisible({ timeout: 15000 });

    // Event details must be visible
    await expect(page.locator('text=Phase 1 test event where booking is closed for everyone')).toBeVisible();
    await expect(page.locator('text=Lotus Tower')).toBeVisible();

    // Booking button must be disabled for everyone
    const disabledBtn = page.locator('button:has-text("Booking Not Open Yet")');
    await expect(disabledBtn).toBeVisible({ timeout: 10000 });
    await expect(disabledBtn).toBeDisabled();
  });

  test('3. Phase 2 (Premium Only Period): Premium VIP Customer CAN book ticket (button ENABLED)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 99,
        full_name: 'Premium Customer',
        email: 'premium99@example.com',
        role: 'customer',
        user_tier: 'premium'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('http://localhost:5173/event/902');
    await expect(page.locator('h1:has-text("Phase 2 Premium Exclusive Gala 2026")')).toBeVisible({ timeout: 15000 });

    // Premium user sees ENABLED ticket reservation link
    const reserveLink = page.locator('a:has-text("Reserve Seats & Book Ticket")');
    await expect(reserveLink).toBeVisible({ timeout: 10000 });
  });

  test('4. Phase 2 (Premium Only Period): Standard Customer CAN view event details, but Book Ticket button is DISABLED with Early Access notice', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 13,
        full_name: 'Standard Customer',
        email: 'standard13@example.com',
        role: 'customer',
        user_tier: 'verified'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('http://localhost:5173/event/902');
    await expect(page.locator('h1:has-text("Phase 2 Premium Exclusive Gala 2026")')).toBeVisible({ timeout: 15000 });

    // Standard user can view event details
    await expect(page.locator('text=Phase 2 test event open only for Premium customers right now')).toBeVisible();
    await expect(page.locator('text=BMICH Arena')).toBeVisible();

    // Reserve button must be disabled for standard customer
    const disabledBtn = page.locator('button:has-text("Premium Early Access Only")');
    await expect(disabledBtn).toBeVisible({ timeout: 10000 });
    await expect(disabledBtn).toBeDisabled();

    // Option to become premium customer must be visible
    await expect(page.locator('button:has-text("Become a Premium Customer to Book Now")')).toBeVisible();
  });

  test('5. Phase 3 (General Opening): Standard Customer CAN book ticket (button ENABLED)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 13,
        full_name: 'Standard Customer',
        email: 'standard13@example.com',
        role: 'customer',
        user_tier: 'verified'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('http://localhost:5173/event/903');
    await expect(page.locator('h1:has-text("Phase 3 Open Gala 2026")')).toBeVisible({ timeout: 15000 });

    // Reserve button enabled for standard customer in Phase 3
    const reserveLink = page.locator('a:has-text("Reserve Seats & Book Ticket")');
    await expect(reserveLink).toBeVisible({ timeout: 10000 });
  });

  test('6. Backend API strictly rejects standard customer booking creation during Phase 1 & Phase 2', async ({ request }) => {
    // Attempt Phase 1 booking (Event #901)
    const res1 = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: { user_id: 13, event_id: 901, ticket_quantity: 1 }
    });
    const data1 = await res1.json();
    expect(data1.success).toBeFalsy();
    expect(data1.message).toContain('Booking Not Open Yet');

    // Attempt Phase 2 booking as Standard Customer (Event #902)
    const res2 = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: { user_id: 13, event_id: 902, ticket_quantity: 1 }
    });
    const data2 = await res2.json();
    expect(data2.success).toBeFalsy();
    expect(data2.message).toContain('Exclusive Early Access Window Active');
  });

});
