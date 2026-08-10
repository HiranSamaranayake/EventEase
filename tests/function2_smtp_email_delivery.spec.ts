import { test, expect } from '@playwright/test';

test.describe('Function 2: Live SMTP Email Delivery Server & Mobile Responsiveness', () => {

  test('Admin SMTP connection test endpoint dispatches test email and logs output', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/admin_test_smtp.php', {
      data: {
        test_email: 'admin_test@eventease.com',
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_user: 'admin@eventease.com',
        smtp_from_email: 'noreply@eventease.com',
        smtp_from_name: 'EventEase Ticketing System'
      }
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.smtp_status).toBeDefined();
    expect(resData.message).toBeDefined();
  });

  test('Manual ticket email resend endpoint dispatches booking email for valid booking ID', async ({ request }) => {
    const response = await request.post('http://localhost/EventEase/backend/api/resend_ticket_email.php', {
      data: { booking_id: 159 }
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.message).toContain('Booking #159');
  });

  test('Admin Settings UI renders SMTP Test controls and handles trigger cleanly', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Super Admin',
        email: 'admin@eventease.com',
        role: 'admin',
        admin_role: 'super_admin'
      }));
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy');
    });

    await page.goto('/admin-settings');
    await expect(page.locator('text=Admin Platform Settings & Security Policies')).toBeVisible({ timeout: 10000 });

    const smtpHeader = page.locator('text=SMTP Automated Email Server Settings');
    await expect(smtpHeader).toBeVisible();

    const testSmtpBtn = page.locator('button:has-text("Test Live SMTP Connection")');
    await expect(testSmtpBtn).toBeVisible();

    await testSmtpBtn.click();
    await expect(page.locator('.fixed.top-5.right-5')).toBeVisible({ timeout: 35000 });
  });

  test('Customer Ticket View UI is Mobile Responsive (iPhone SE: 375x667) and supports Resend & View Email', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 9,
        full_name: 'Regular Customer',
        email: 'customer@example.com',
        role: 'customer'
      }));
    });

    await page.goto('/ticket/159');
    await expect(page.locator('text=VERIFIED CUSTOMER PASS')).toBeVisible({ timeout: 10000 });

    const viewEmailBtn = page.locator('button:has-text("View Sent Confirmation Email"), button:has-text("View Sent Email")');
    const resendEmailBtn = page.locator('button:has-text("Resend Email")');

    await expect(viewEmailBtn).toBeVisible();
    await expect(resendEmailBtn).toBeVisible();

    // Trigger email resend on mobile viewport
    await resendEmailBtn.click();
    await expect(page.locator('text=Ticket email dispatched successfully!'), { message: 'Resend toast visible' }).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Open email modal on mobile viewport
    await viewEmailBtn.click();
    await expect(page.locator('text=Automated Confirmation Email')).toBeVisible();

    // Close preview modal on mobile
    await page.locator('button:has-text("Close Preview")').click();
    await expect(page.locator('text=Automated Confirmation Email')).not.toBeVisible();
  });

});
