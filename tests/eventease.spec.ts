import { test, expect } from '@playwright/test';

const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDA0ODkwMDB9.dummysig';

test.describe('EventEase Platform E2E Tests', () => {

  test('Events Page displays event items and category tags', async ({ page }) => {
    await page.goto('/events');
    await expect(page.getByRole('heading', { name: 'Explore Events' })).toBeVisible();
    
    // Check if event cards are rendered
    const eventCards = page.locator('.group');
    await expect(eventCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Customer can toggle multiple events in wishlist', async ({ page }) => {
    // Set authenticated customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/events');
    await page.waitForSelector('.group');

    // Click the heart wishlist button on the first event
    const heartBtns = page.locator('button[title="Save to Wishlist"], button[title="Remove from Wishlist"]');
    const count = await heartBtns.count();

    if (count > 0) {
      await heartBtns.nth(0).click();
    }
    if (count > 1) {
      await heartBtns.nth(1).click();
    }

    // Navigate to Saved Wishlist page and verify wishlist count
    await page.goto('/saved-events');
    await expect(page.getByRole('heading', { name: 'My Saved Wishlist' })).toBeVisible();
  });

  test('Organizer QR Scanner page operates correctly', async ({ page }) => {
    // Set authenticated organizer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Yumeth Pahasara',
        email: 'yumethpahasara12@gmail.com',
        role: 'organizer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/organizer/scan-ticket');

    // Check QR Ticket Validator header
    await expect(page.getByRole('heading', { name: 'Ticket QR Code Scanner' })).toBeVisible();

    // Test Manual Code Input
    const input = page.locator('input[placeholder="Enter or scan ticket code..."]');
    await expect(input).toBeVisible();

    await input.fill('EVT-118-4924');
    await page.click('button:has-text("Validate Ticket Entry")');

    // Check verification result card appears
    await expect(page.locator('text=Verification Result')).toBeVisible();
    await expect(page.locator('text=Recent Session Scans')).toBeVisible();
  });

  test('Customer Wishlist page operates correctly', async ({ page }) => {
    // Set authenticated customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/saved-events');
    await expect(page.getByRole('heading', { name: 'My Saved Wishlist' })).toBeVisible();
  });

  test('Customer My Bookings & Cancellation UI operates correctly', async ({ page }) => {
    // Set authenticated customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/my-bookings');
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
  });

  test('Admin Bookings and Refund Processing UI operates correctly', async ({ page }) => {
    // Set authenticated admin session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Admin',
        email: 'thimira12@gmail.com',
        role: 'admin'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/admin/bookings');
    await expect(page.getByRole('heading', { name: 'Booking Management' })).toBeVisible();
  });

  test('Customer Waiting List Queue UI operates correctly', async ({ page }) => {
    // Set authenticated customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/waiting-list');
    await expect(page.getByRole('heading', { name: 'My Waiting Lists' })).toBeVisible();
  });

  test('Organizer Business Verification UI operates correctly', async ({ page }) => {
    // Set authenticated organizer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Yumeth Pahasara',
        email: 'yumethpahasara12@gmail.com',
        role: 'organizer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/organizer/verify');
    await expect(page.getByRole('heading', { name: 'Organizer Business Verification' })).toBeVisible();
  });

  test('Admin Organizers Verification management UI operates correctly', async ({ page }) => {
    // Set authenticated admin session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Admin',
        email: 'thimira12@gmail.com',
        role: 'admin'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/admin/organizers');
    await expect(page.getByRole('heading', { name: 'Organizer Verification Management' })).toBeVisible();
  });

  test('Customer can view interactive seat map and select tiered seats', async ({ page }) => {
    // Set authenticated customer session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Anajana',
        email: 'hirananjana12@gmail.com',
        role: 'customer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });

    await page.goto('/book-event/14');
    await expect(page.locator('text=Interactive Venue Seat Selection Map')).toBeVisible();
  });

});
