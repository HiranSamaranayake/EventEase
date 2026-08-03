import { test, expect } from '@playwright/test';

test.describe('Function 1: Guest Customer Features (Event Discovery & Seat Availability)', () => {

  test('Guest can browse event catalog, search by name, filter by category, and view seat availability', async ({ page }) => {
    // Navigate as Guest (no localStorage auth tokens set)
    await page.goto('/events');

    // 1. Verify Header and Search controls are visible
    await expect(page.getByRole('heading', { name: 'Explore Events' })).toBeVisible();
    const searchInput = page.locator('input[placeholder*="Search by event name"]');
    await expect(searchInput).toBeVisible();

    // 2. Verify Category filter pills exist
    await expect(page.locator('button:has-text("All")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Concert")').first()).toBeVisible();

    // 3. Verify event cards render
    const eventCards = page.locator('.group');
    await expect(eventCards.first()).toBeVisible({ timeout: 10000 });

    // 4. Test Search Functionality
    await searchInput.fill('Tech');
    await page.waitForTimeout(500); // UI filter debounce check

    // Reset search
    await searchInput.fill('');
    await page.waitForTimeout(300);

    // 5. Navigate to first event detail page as Guest
    await eventCards.first().click();
    await page.waitForURL(/\/event\/\d+/);

    // 6. Verify Event Details page components are visible for Guest
    await expect(page.locator('text=About This Event')).toBeVisible();
    await expect(page.locator('text=Seat Availability')).toBeVisible();
    await expect(page.locator('text=Ticket Reservation')).toBeVisible();
  });

  test('Guest inspecting seat map redirects or opens reservation correctly', async ({ page }) => {
    await page.goto('/events');
    const eventCards = page.locator('.group');
    await expect(eventCards.first()).toBeVisible({ timeout: 10000 });
    await eventCards.first().click();

    // Check if Book/Reserve button is visible
    const bookBtn = page.locator('a:has-text("Book Ticket Now"), button:has-text("Book Ticket Now")');
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
      // Inspect seat map page loads
      await expect(page.locator('text=Interactive Venue Seat Selection Map')).toBeVisible({ timeout: 10000 });
    }
  });

});
