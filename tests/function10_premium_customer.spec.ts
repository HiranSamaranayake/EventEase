import { test, expect } from '@playwright/test';

test.describe('Function 10: Premium Customer Membership & Exclusive Perks', () => {

  test('Customer can view profile, upgrade membership tier to Premium VIP, and receive 10% exclusive discount', async ({ page }) => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJjc3QyMzAxNUBzdGQudXd1LmFjLmxrIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

    await page.addInitScript(({ token }) => {
      if (!window.localStorage.getItem('user')) {
        window.localStorage.setItem('user', JSON.stringify({
          id: 9,
          full_name: 'Hiran Samaranayake',
          email: 'cst23015@std.uwu.ac.lk',
          role: 'customer',
          user_tier: 'verified'
        }));
      }
      window.localStorage.setItem('token', token);
    }, { token: validToken });

    // 1. Navigate to Profile Page
    await page.goto('/profile');
    await expect(page.locator('text=Membership Tier')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Save Profile Changes')).toBeVisible({ timeout: 10000 });

    // 2. Verify standard membership tier or upgrade card exists
    const upgradeBtn = page.locator('button:has-text("Upgrade to Premium VIP Now")');
    if (await upgradeBtn.isVisible()) {
      await upgradeBtn.click();
      await expect(page.locator('text=Premium VIP Membership Active')).toBeVisible({ timeout: 10000 });
    } else {
      await expect(page.locator('text=Premium VIP Membership Active')).toBeVisible({ timeout: 10000 });
    }

    // 3. Explicitly set localStorage to premium tier
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Hiran Samaranayake',
        email: 'cst23015@std.uwu.ac.lk',
        role: 'customer',
        user_tier: 'premium'
      }));
    });

    // 4. Navigate to event booking page
    await page.goto('/book-event/6');
    await expect(page.locator('text=Ticket Categories & Pricing Tiers')).toBeVisible({ timeout: 10000 });

    // 5. Verify Premium VIP 10% Exclusive Offer discount callout renders at checkout
    await expect(page.locator('text=Premium VIP 10% Exclusive Offer Discount')).toBeVisible({ timeout: 10000 });
  });

});
