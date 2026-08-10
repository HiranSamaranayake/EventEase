import { test, expect } from '@playwright/test';

test.describe('Organizer Dashboard -> My Events Scope Filtering & Security Protection', () => {

  test('1. Organizer A sees ONLY their events in my_events API response', async ({ request }) => {
    const res = await request.get('http://localhost/EventEase/backend/api/my_events.php?user_id=5');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBeTruthy();
    expect(Array.isArray(data.events)).toBeTruthy();

    const titles = data.events.map((e: any) => e.title);
    // Should include Organizer A's event
    expect(titles).toContain('Tech Conference 2026 - Updated');
    // Should NOT include Organizer B's event
    expect(titles).not.toContain('Organizer B Exclusive Expo 2026');
  });

  test('2. Organizer B sees ONLY their events in my_events API response', async ({ request }) => {
    const res = await request.get('http://localhost/EventEase/backend/api/my_events.php?user_id=98');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBeTruthy();
    expect(Array.isArray(data.events)).toBeTruthy();

    const titles = data.events.map((e: any) => e.title);
    // Should include Organizer B's event
    expect(titles).toContain('Organizer B Exclusive Expo 2026');
    // Should NOT include Organizer A's event
    expect(titles).not.toContain('Tech Conference 2026 - Updated');
  });

  test('3. Organizer B is BLOCKED from viewing/editing Organizer A\'s event details (get_event.php)', async ({ request }) => {
    const res = await request.get('http://localhost/EventEase/backend/api/get_event.php?id=1&user_id=98');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBeFalsy();
    expect(data.message).toContain('Unauthorized access');
  });

  test('4. Organizer B is BLOCKED from updating Organizer A\'s event (update_event.php)', async ({ request }) => {
    const res = await request.post('http://localhost/EventEase/backend/api/update_event.php', {
      data: {
        event_id: 1,
        user_id: 98, // Organizer B trying to update Organizer A's event
        title: 'Hacked Event Title By Organizer B',
        description: 'Unauthorized edit',
        event_date: '2026-12-25',
        location: 'Colombo',
        capacity: 100,
        price: 50
      }
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBeFalsy();
    expect(data.message).toContain('Unauthorized access');

    // Verify event title in DB was NOT changed
    const checkRes = await request.get('http://localhost/EventEase/backend/api/get_event.php?id=1');
    const checkData = await checkRes.json();
    expect(checkData.event.title).toBe('Tech Conference 2026 - Updated');
  });

  test('5. Organizer B is BLOCKED from deleting Organizer A\'s event (delete_event.php)', async ({ request }) => {
    const res = await request.post('http://localhost/EventEase/backend/api/delete_event.php', {
      data: {
        event_id: 1,
        user_id: 98 // Organizer B trying to delete Organizer A's event
      }
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBeFalsy();
    expect(data.message).toContain('Unauthorized access');

    // Verify event still exists
    const checkRes = await request.get('http://localhost/EventEase/backend/api/get_event.php?id=1');
    const checkData = await checkRes.json();
    expect(checkData.success).toBeTruthy();
  });

  test('6. Frontend EditEvent UI blocks unauthorized organizer with Access Denied screen', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 98, // Organizer B
        full_name: 'Organizer B User',
        email: 'organizerb@example.com',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    // Attempt to access EditEvent page for Event 1 (owned by Organizer A)
    await page.goto('/organizer/edit-event/1');
    await expect(page.locator('text=Access Denied')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Unauthorized access')).toBeVisible();
  });

  test('7. My Events UI is fully Mobile Responsive across Desktop (1280x800), Tablet (768x1024), and Mobile (375x667)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 5, // Organizer A
        full_name: 'Yumeth Pahasara',
        email: 'yumethpahasara12@gmail.com',
        role: 'organizer'
      }));
      localStorage.setItem('token', 'dummy_jwt_token');
    });

    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/organizer/my-events');
    await expect(page.locator('h1:has-text("My Events")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Tech Conference 2026 - Updated')).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1:has-text("My Events")')).toBeVisible();

    // Mobile (iPhone SE: 375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("My Events")')).toBeVisible();
  });

});
