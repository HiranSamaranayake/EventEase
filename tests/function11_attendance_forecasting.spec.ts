import { test, expect } from '@playwright/test';

test.describe('Function 11: Organizer Attendance Forecasting & Predictive Analytics', () => {

  test('Verified Organizer can view attendance forecasts, turnout probability, and predictive sales analytics', async ({ page }) => {
    // Valid JWT token with exp in 2077 and organizer role
    const validOrganizerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJvcmdhbml6ZXJAc3RkLnV3dS5hYy5sayIsInJvbGUiOiJvcmdhbml6ZXIiLCJleHAiOjI1MzMyOTk5OTk5fQ.dummy';

    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 5,
        full_name: 'Tech Events Organizer',
        email: 'organizer@std.uwu.ac.lk',
        role: 'organizer'
      }));
      window.localStorage.setItem('token', token);
    }, { token: validOrganizerToken });

    // 1. Navigate to Organizer Analytics Page
    await page.goto('/organizer/analytics');

    // 2. Verify Page Title
    await expect(page.locator('h1:has-text("Organizer Analytics & Attendance Forecasting")')).toBeVisible({ timeout: 10000 });

    // 3. Verify Function 11 Module Card & Predictive Metrics render
    await expect(page.locator('text=Attendance Forecasting & Predictive Turnout Analytics')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Projected Venue Attendance')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Average Occupancy Rate')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Estimated Peak Arrival')).toBeVisible({ timeout: 10000 });

    // 4. Verify Revenue Trend Chart & Monthly Volume Charts render
    await expect(page.locator('text=Monthly Revenue Trend')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Monthly Bookings Volume')).toBeVisible({ timeout: 10000 });
  });

});
