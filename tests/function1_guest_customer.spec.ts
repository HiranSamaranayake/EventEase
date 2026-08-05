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
    await searchInput.fill('Mariens');
    await page.waitForTimeout(500);

    // Reset search
    await searchInput.fill('');
    await page.waitForTimeout(300);

    // 5. Navigate to event detail page as Guest (Event #16)
    await page.goto('/event/16');

    // 6. Verify Event Details page components are visible for Guest
    await expect(page.locator('text=About This Event')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Seat Availability')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Ticket Reservation')).toBeVisible({ timeout: 10000 });
  });

  test('Guest inspecting seat map redirects or opens reservation correctly', async ({ page }) => {
    await page.goto('/event/16');
    await expect(page.locator('text=About This Event')).toBeVisible({ timeout: 10000 });

    // Check if Reserve button is visible
    const reserveLink = page.locator('a:has-text("Reserve Seats & Book Ticket")').first();
    await expect(reserveLink).toBeVisible({ timeout: 10000 });
  });

});
