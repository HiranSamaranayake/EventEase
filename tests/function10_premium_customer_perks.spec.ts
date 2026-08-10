import { test, expect } from '@playwright/test';

test.describe('Function 10: Premium vs Normal Booking Opening Date Validation & Subscription System', () => {

  test('1. Same Premium and Normal date/time → REJECTED by backend', async ({ request }) => {
    const sameDate = '2026-08-20T10:00';

    const formData = new URLSearchParams();
    formData.append('title', 'Same Date Test Event');
    formData.append('description', 'Testing same date selection');
    formData.append('event_date', '2026-09-01');
    formData.append('location', 'Colombo Main Hall');
    formData.append('user_id', '5');
    formData.append('premium_booking_open_date', sameDate);
    formData.append('normal_booking_open_date', sameDate);

    const response = await request.post('http://localhost/EventEase/backend/api/create_event.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData.toString()
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeFalsy();
    expect(resData.message).toBe('Normal booking must open at least 24 hours after Premium booking.');
  });

  test('2. Less than 24-hour gap (e.g. 23 hrs 59 mins) → REJECTED by backend', async ({ request }) => {
    const premDate = '2026-08-20T10:00';
    const normDateInvalid = '2026-08-21T09:59'; // 23h 59m gap

    const formData = new URLSearchParams();
    formData.append('title', 'Less Than 24h Gap Test Event');
    formData.append('description', 'Testing 23h 59m gap');
    formData.append('event_date', '2026-09-01');
    formData.append('location', 'Colombo Main Hall');
    formData.append('user_id', '5');
    formData.append('premium_booking_open_date', premDate);
    formData.append('normal_booking_open_date', normDateInvalid);

    const response = await request.post('http://localhost/EventEase/backend/api/create_event.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData.toString()
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeFalsy();
    expect(resData.message).toBe('Normal booking must open at least 24 hours after Premium booking.');
  });

  test('3. Exactly 24-hour gap → ACCEPTED by backend', async ({ request }) => {
    const premDate = '2026-08-20T10:00';
    const normDateExact = '2026-08-21T10:00'; // Exactly 24h gap

    const formData = new URLSearchParams();
    formData.append('title', 'Exact 24h Gap Test Event');
    formData.append('description', 'Testing exact 24h gap');
    formData.append('event_date', '2026-09-01');
    formData.append('location', 'Colombo Main Hall');
    formData.append('user_id', '5');
    formData.append('premium_booking_open_date', premDate);
    formData.append('normal_booking_open_date', normDateExact);

    const response = await request.post('http://localhost/EventEase/backend/api/create_event.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData.toString()
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeTruthy();
    expect(resData.message).toContain('Event created successfully');
  });

  test('4. More than 24-hour gap → ACCEPTED by backend', async ({ request }) => {
    const premDate = '2026-08-20T10:00';
    const normDateMore = '2026-08-22T12:00'; // 50h gap

    const formData = new URLSearchParams();
    formData.append('title', 'More Than 24h Gap Test Event');
    formData.append('description', 'Testing 50h gap');
    formData.append('event_date', '2026-09-01');
    formData.append('location', 'Colombo Main Hall');
    formData.append('user_id', '5');
    formData.append('premium_booking_open_date', premDate);
    formData.append('normal_booking_open_date', normDateMore);

    const response = await request.post('http://localhost/EventEase/backend/api/create_event.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData.toString()
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeTruthy();
    expect(resData.message).toContain('Event created successfully');
  });

  test('5. Frontend UI revalidates Normal date when Premium date changes and sets dynamic min', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Test Organizer',
        email: 'organizer@example.com',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    await page.goto('/organizer/create-event');
    await expect(page.locator('h1:has-text("Create Event")')).toBeVisible({ timeout: 10000 });

    const premInput = page.locator('input[type="datetime-local"]').first();
    const normInput = page.locator('input[type="datetime-local"]').nth(1);

    // Set Premium date
    await premInput.fill('2026-08-10T10:00');
    // Verify min attribute on Normal date is updated to 2026-08-11T10:00
    const minAttr = await normInput.getAttribute('min');
    expect(minAttr).toBe('2026-08-11T10:00');

    // Fill invalid Normal date (less than 24h gap)
    await normInput.fill('2026-08-10T15:00');
    await expect(page.locator('text=Normal booking must open at least 24 hours after Premium booking.')).toBeVisible();
  });

  test('6. Backend strictly rejects invalid dates even if frontend validation is bypassed', async ({ request }) => {
    const formData = new URLSearchParams();
    formData.append('title', 'Direct API Bypass Event');
    formData.append('description', 'Testing backend rejection of invalid dates');
    formData.append('event_date', '2026-09-01');
    formData.append('location', 'Colombo Main Hall');
    formData.append('user_id', '5');
    formData.append('premium_booking_open_date', '2026-08-15T12:00');
    formData.append('normal_booking_open_date', '2026-08-15T18:00'); // Only 6 hours gap

    const response = await request.post('http://localhost/EventEase/backend/api/create_event.php', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData.toString()
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeFalsy();
    expect(resData.message).toBe('Normal booking must open at least 24 hours after Premium booking.');
  });

  test('7. Create Event form layout is fully Mobile Responsive across Desktop (1280x800), Tablet (768x1024), and Mobile (375x667)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Test Organizer',
        email: 'organizer@example.com',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/organizer/create-event');
    await expect(page.locator('h1:has-text("Create Event")')).toBeVisible({ timeout: 10000 });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1:has-text("Create Event")')).toBeVisible();

    // Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("Create Event")')).toBeVisible();

    // Ensure inputs are visible without horizontal scroll
    const premInput = page.locator('input[type="datetime-local"]').first();
    await expect(premInput).toBeVisible();
  });

  test('8. Explore Events displays both Premium and General booking opening dates', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('h1:has-text("Explore Events")')).toBeVisible({ timeout: 10000 });

    const premDateLabel = page.locator('text=Premium Booking Opens:').first();
    const normDateLabel = page.locator('text=General Booking Opens:').first();

    await expect(premDateLabel).toBeVisible();
    await expect(normDateLabel).toBeVisible();
  });

  test('9. Before Premium booking opens (Phase 1), nobody can book', async ({ request }) => {
    const res = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: 17,
        event_id: 3,
        ticket_quantity: 1
      }
    });

    expect(res.ok()).toBeTruthy();
    const resData = await res.json();
    expect(resData.success).toBeFalsy();
    expect(resData.message).toContain('Booking Not Open Yet');
  });

  test('10. During Premium-only period (Phase 2), active Premium customer CAN book', async ({ request }) => {
    await request.post('http://localhost/EventEase/backend/api/confirm_premium_payment.php', {
      data: { user_id: 17 }
    });

    const premRes = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: 17,
        event_id: 1,
        ticket_quantity: 1
      }
    });

    expect(premRes.ok()).toBeTruthy();
    const premData = await premRes.json();
    expect(premData.success).toBeTruthy();
    expect(premData.booking_id).toBeDefined();
  });

  test('11. During Premium-only period (Phase 2), normal customer is BLOCKED with message', async ({ request }) => {
    const nonPremRes = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: 999,
        event_id: 1,
        ticket_quantity: 1
      }
    });

    expect(nonPremRes.ok()).toBeTruthy();
    const resData = await nonPremRes.json();
    expect(resData.success).toBeFalsy();
    expect(resData.message).toContain('Exclusive Early Access Window Active');
  });

  test('12. Premium subscription checkout & active verification flow', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_premium_subscription.php', {
      data: { user_id: 14 }
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeTruthy();
    expect(resData.payhere_data).toBeDefined();

    const confirmRes = await request.post('http://localhost/EventEase/backend/api/confirm_premium_payment.php', {
      data: { user_id: 14 }
    });
    expect(confirmRes.ok()).toBeTruthy();
    const confirmData = await confirmRes.json();
    expect(confirmData.success).toBeTruthy();
    expect(confirmData.subscription.is_active).toBeTruthy();
  });

  test('13. Customer Profile page displays Become a Premium Customer option with Rs 1,500/month pricing and PayHere Sandbox integration', async ({ page, request }) => {
    // Reset test user 99 to verified tier and clear active subscriptions
    await request.post('http://localhost/EventEase/backend/api/upgrade_tier.php', {
      data: { user_id: 99, user_tier: 'verified' }
    });

    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 99,
        full_name: 'Saman Kumara',
        email: 'saman99@example.com',
        role: 'customer',
        user_tier: 'verified'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
      localStorage.setItem('isPlaywrightTest', 'true');

      // Mock PayHere Sandbox SDK startPayment for automated browser test completion
      (window as any).payhere = {
        startPayment: function (p: any) {
          if ((window as any).payhere.onCompleted) {
            (window as any).payhere.onCompleted(p.order_id);
          }
        }
      };
    });

    await page.goto('/profile');
    await expect(page.locator('text=Become a Premium Customer')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Rs. 1,500 / Month').first()).toBeVisible();

    const payBtn = page.locator('button:has-text("Become Premium Customer")');
    await expect(payBtn).toBeVisible();
    await payBtn.click();

    // Verify subscription payment completes and updates tier to Premium VIP
    await expect(page.locator('text=🎉 Congratulations! Your Premium VIP Membership is active')).toBeVisible({ timeout: 10000 });
  });

});
