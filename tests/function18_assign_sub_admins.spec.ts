import { test, expect } from '@playwright/test';

test.describe('Function 18: Super Admin Sub-Admin Creation & Role Assignment System', () => {

  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ0aGltaXJhMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTMzMjk5OTk5OX0.dummy';

  test('Super Admin can assign sub-admin role to existing user and create a brand new sub-admin account', async ({ page }) => {
    // 1. Initial Page Load and set Super Admin Auth Session in LocalStorage
    await page.goto('/');
    await page.evaluate(({ token }) => {
      localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Super Admin',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'super_admin'
      }));
      localStorage.setItem('token', token);
    }, { token: validToken });

    // 2. Navigate to Admin Users & Sub-Admin Governance Page
    await page.goto('/admin-users');
    await expect(page.getByRole('heading', { name: /User Management & Sub-Admin Governance/i })).toBeVisible({ timeout: 10000 });

    // 3. Test Add New Sub-Admin button & modal
    const addSubAdminBtn = page.getByRole('button', { name: /Add New Sub-Admin/i });
    await expect(addSubAdminBtn).toBeVisible({ timeout: 10000 });
    await addSubAdminBtn.click();

    // 4. Verify Create New Sub-Admin Account modal opens
    await expect(page.locator('text=Create New Sub-Admin Account').first()).toBeVisible({ timeout: 10000 });

    // Fill New Sub-Admin Form
    const newAdminEmail = 'subadmin_' + Math.floor(Math.random() * 100000) + '@eventease.com';
    await page.fill('input[placeholder*="Kasun"]', 'Kasun Junior Admin');
    await page.fill('input[placeholder*="admin@eventease.com"]', newAdminEmail);
    await page.fill('input[placeholder*="••••••••"]', 'admin123');

    // Submit form
    const submitBtn = page.getByRole('button', { name: /Create Sub-Admin Account/i });
    await submitBtn.click();

    // 5. Verify newly created Sub-Admin account renders in user table
    await expect(page.locator(`text=${newAdminEmail}`).first()).toBeVisible({ timeout: 10000 });

    // 6. Test Assign Sub-Role on existing user
    const assignRoleBtn = page.locator('button:has-text("Assign Sub-Role")').first();
    await expect(assignRoleBtn).toBeVisible({ timeout: 10000 });
    await assignRoleBtn.click();

    // Verify Assign Sub-Role modal opens
    await expect(page.locator('text=Assign Sub-Admin Role to Existing User').first()).toBeVisible({ timeout: 10000 });

    // Save Sub-Role
    const saveRoleBtn = page.getByRole('button', { name: /Save Sub-Role/i });
    await saveRoleBtn.click();
  });

});
