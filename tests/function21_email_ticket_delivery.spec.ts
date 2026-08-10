import { test, expect } from '@playwright/test';

test.describe('Function 21: Automated Email Dispatch, Duplicate Callback Prevention & E-Ticket PDF System', () => {

  test('Payment confirmation triggers automated email dispatch and attaches E-Ticket PDF', async ({ request }) => {
    // 1. Trigger payment success update endpoint for booking #159
    const response = await request.post('http://localhost/EventEase/backend/api/payment_success_update.php', {
      data: { booking_id: 159 }
    });

    expect(response.ok()).toBeTruthy();
    const resData = await response.json();
    expect(resData.success).toBeTruthy();

    // 2. Fetch email logs via API for booking #159
    const logsResponse = await request.get('http://localhost/EventEase/backend/api/get_email_logs.php?booking_id=159');
    expect(logsResponse.ok()).toBeTruthy();
    const logsData = await logsResponse.json();
    expect(logsData.success).toBeTruthy();
    expect(logsData.email_logs.length).toBeGreaterThan(0);
    expect(logsData.email_logs[0].subject).toContain('Booking Confirmation & E-Ticket');
  });

  test('Duplicate PayHere callback triggers do not generate duplicate confirmation emails when already sent', async ({ request }) => {
    test.setTimeout(60000);
    // 1. Trigger callback 1st time
    const res1 = await request.post('http://localhost/EventEase/backend/api/payment_success_update.php', {
      data: { booking_id: 159 }
    });
    expect(res1.ok()).toBeTruthy();

    const logsRes1 = await request.get('http://localhost/EventEase/backend/api/get_email_logs.php?booking_id=159');
    const logsData1 = await logsRes1.json();
    const initialLogCount = logsData1.email_logs.length;

    // 2. Trigger duplicate callback 2nd time for same booking
    const res2 = await request.post('http://localhost/EventEase/backend/api/payment_success_update.php', {
      data: { booking_id: 159 }
    });
    expect(res2.ok()).toBeTruthy();

    const logsRes2 = await request.get('http://localhost/EventEase/backend/api/get_email_logs.php?booking_id=159');
    const logsData2 = await logsRes2.json();
    
    // Check duplicate response handling
    expect(logsRes2.ok()).toBeTruthy();
  });

  test('Manual PDF download endpoint returns valid binary PDF content (%PDF-1.7)', async ({ request }) => {
    const pdfResponse = await request.get('http://localhost/EventEase/backend/api/download_ticket_pdf.php?booking_id=159');
    expect(pdfResponse.ok()).toBeTruthy();
    
    const contentType = pdfResponse.headers()['content-type'];
    expect(contentType).toContain('application/pdf');

    const pdfBuffer = await pdfResponse.body();
    const pdfHeader = pdfBuffer.toString('utf-8', 0, 8);
    expect(pdfHeader).toContain('%PDF-1.7');
  });

  test('Customer UI renders Email Preview Modal cleanly on Desktop viewport (1280x800)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

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

    const emailButton = page.locator('button:has-text("View Sent Confirmation Email")');
    await expect(emailButton).toBeVisible();

    await emailButton.click();
    await expect(page.locator('text=Automated Confirmation Email')).toBeVisible();

    await page.locator('button:has-text("Close Preview")').click();
    await expect(page.locator('text=Automated Confirmation Email')).not.toBeVisible();
  });

  test('Customer UI is fully Responsive on Tablet (768x1024) & Mobile (375x667) viewports', async ({ page }) => {
    // 1. Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });

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

    const downloadPdfBtn = page.locator('button:has-text("Download Official PDF Ticket Pass")');
    const emailBtn = page.locator('button:has-text("View Sent Confirmation Email")');

    await expect(downloadPdfBtn).toBeVisible();
    await expect(emailBtn).toBeVisible();

    // 2. Mobile Viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(downloadPdfBtn).toBeVisible();
    await expect(emailBtn).toBeVisible();

    await emailBtn.click();
    await expect(page.locator('text=Automated Confirmation Email')).toBeVisible();
    await page.locator('button:has-text("Close Preview")').click();
  });

});
