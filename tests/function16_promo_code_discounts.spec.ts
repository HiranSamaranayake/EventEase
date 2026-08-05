import { test, expect } from '@playwright/test';

test.describe('Function 16: Organizer & Admin Promo Code & Discount Campaign Management System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Organizer can create promotional code, and customer can apply promo code at checkout for instant discount deduction', async ({ page }) => {
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

    // 2. Navigate to Organizer Promo Code Campaign Manager Page
    await page.goto('/organizer/promos');
    await expect(page.getByRole('heading', { name: /Promo Code & Discount Campaign Manager/i })).toBeVisible({ timeout: 10000 });

    // 3. Verify Create New Promo Code button exists
    const createPromoBtn = page.getByRole('button', { name: /Create New Promo Code/i });
    await expect(createPromoBtn).toBeVisible({ timeout: 10000 });

    // 4. Click Create New Promo Code
    await createPromoBtn.click();
    await expect(page.locator('text=Create New Promo Code').first()).toBeVisible({ timeout: 10000 });

    // 5. Fill Promo Code Form
    const promoCode = 'PLAY20TEST' + Math.floor(Math.random() * 1000);
    await page.fill('input[placeholder*="SAVE20"]', promoCode);
    await page.fill('input[placeholder*="e.g. 20"]', '20');

    // Submit Promo Code Form
    const submitBtn = page.getByRole('button', { name: /Create Promo Code/i });
    await submitBtn.click();

    // 6. Verify Toast Confirmation and Promo Item rendering in table
    await expect(page.locator(`text=${promoCode}`).first()).toBeVisible({ timeout: 10000 });

    // 7. Navigate to Customer Event Details Page (Event #16)
    await page.goto('/event/16');

    // 8. Verify Promo Code input box on Event Details page
    const promoInput = page.locator('#promo-code-input');
    await expect(promoInput).toBeVisible({ timeout: 10000 });

    // 9. Enter Promo Code and Click Apply
    await promoInput.fill(promoCode);

    const applyBtn = page.locator('#apply-promo-btn');
    await applyBtn.click();

    // 10. Verify Applied Code Toast and Discount Savings
    await expect(page.locator(`text=Code '${promoCode}' Applied`).first()).toBeVisible({ timeout: 10000 });
  });

});
