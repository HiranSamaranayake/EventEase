import { test, expect } from '@playwright/test';

test.describe('Function 19: Verified Organizer Venue Seating Layout & Tier Pricing Configurator', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Verified Organizer can access Venue Seating Configurator, define seating tier grid, and preview layout', async ({ page }) => {
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

    // 2. Navigate to Organizer Venue Seating Configurator Page
    await page.goto('/organizer/seating');
    await expect(page.getByRole('heading', { name: /Venue Seating Layout & Tiered Pricing Configurator/i })).toBeVisible({ timeout: 10000 });

    // 3. Verify Add Venue Seating Tier button exists
    const addTierBtn = page.getByRole('button', { name: /Add Venue Seating Tier/i });
    await expect(addTierBtn).toBeVisible({ timeout: 10000 });

    // 4. Click Add Venue Seating Tier
    await addTierBtn.click();
    await expect(page.locator('text=Add Venue Seating Tier Section').first()).toBeVisible({ timeout: 10000 });

    // 5. Fill Seating Section Form
    const sectionTitle = 'Playwright VIP Zone ' + Math.floor(Math.random() * 1000);
    await page.fill('input[placeholder*="VIP Front Row"]', sectionTitle);
    await page.fill('input[placeholder*="Front row stage view"]', 'Free Beverage + VIP Pass');

    // Submit form
    const saveBtn = page.getByRole('button', { name: /Save Seating Section/i });
    await saveBtn.click();

    // 6. Verify newly created seating section renders in layout cards
    await expect(page.locator(`text=${sectionTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

});
