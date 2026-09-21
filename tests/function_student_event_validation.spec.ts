import { test, expect } from '@playwright/test';

test.describe('Student & Restricted Event Booking Validation', () => {

  let testUserId = 9999;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('http://localhost/EventEase/backend/setup_student_validation_test.php');
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      if (body.user_id) testUserId = body.user_id;
    } catch (e) {
      console.log('setup_student_validation_test text output:', text);
    }
  });

  test('1. Backend API rejects booking for restricted event when no student email or passcode is provided', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: testUserId,
        event_id: 998, // Restricted event
        user_email: 'randomperson@gmail.com',
        student_passcode: ''
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeFalsy();
    expect(data.message).toContain('Access Denied');
    expect(data.message).toContain('restricted');
  });

  test('2. Backend API accepts booking for restricted event when valid student email domain (@std.uwu.ac.lk) is provided', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: testUserId,
        event_id: 998,
        user_email: 'cst23053@std.uwu.ac.lk',
        student_passcode: ''
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    if (!data.success) console.log('Test 2 failure message:', data.message);
    expect(data.success).toBeTruthy();
    expect(data.booking_id).toBeDefined();
  });

  test('3. Backend API accepts booking for restricted event when valid student passcode (UNI2026) is provided', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: testUserId,
        event_id: 998,
        user_email: 'outsideuser@yahoo.com',
        student_passcode: 'UNI2026'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    if (!data.success) console.log('Test 3 failure message:', data.message);
    expect(data.success).toBeTruthy();
    expect(data.booking_id).toBeDefined();
  });

  test('4. Backend API allows booking for public event without audience restrictions', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: testUserId,
        event_id: 999, // Public event
        user_email: 'anyone@gmail.com'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    if (!data.success) console.log('Test 4 failure message:', data.message);
    expect(data.success).toBeTruthy();
    expect(data.booking_id).toBeDefined();
  });

  test('5. Restricted event details page displays Target Audience Limitation banner', async ({ page }) => {
    await page.goto('http://localhost:5173/event/998');
    await expect(page.locator('h1')).toContainText('Campus Tech Fest 2026', { timeout: 15000 });
    await expect(page.locator('text=Target Audience Limitation').first()).toBeVisible();
    await expect(page.locator('text=University Students Only').first()).toBeVisible();
  });

});
