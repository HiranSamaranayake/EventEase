import { test, expect } from '@playwright/test';

const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDA0ODkwMDB9.dummysig';

test.describe('Function 1: Role-Based Sub-Admin Governance System', () => {

  test.beforeEach(async ({ page }) => {
    // Inject Super Admin Session
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 7,
        full_name: 'Thimira Super Admin',
        email: 'thimira12@gmail.com',
        role: 'admin',
        admin_role: 'super_admin'
      }));
      window.localStorage.setItem('token', token);
    }, { token: dummyToken });
  });

  test('Navigates to Sub-Admins Governance Center and displays role summary cards', async ({ page }) => {
    await page.goto('/admin-subadmins');

    // Check heading
    await expect(page.getByRole('heading', { name: 'Sub-Admin Governance Center' })).toBeVisible();

    // Check role summary cards
    await expect(page.locator('text=Super Admin').first()).toBeVisible();
    await expect(page.locator('text=Junior / Support Admin').first()).toBeVisible();
    await expect(page.locator('text=Financial Admin').first()).toBeVisible();
    await expect(page.locator('text=Security Admin').first()).toBeVisible();
  });

  test('Opens Provision New Sub-Admin Modal and displays sub-role selection options', async ({ page }) => {
    await page.goto('/admin-subadmins');

    // Click Provision / Promote Sub-Admin button
    const btn = page.getByRole('button', { name: 'Provision / Promote Sub-Admin' });
    await expect(btn).toBeVisible();
    await btn.click();

    // Verify modal elements
    await expect(page.locator('text=Provision New Sub-Admin Account')).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. Sarah Jenkins"]')).toBeVisible();
    await expect(page.locator('input[placeholder="sarah@eventease.com"]')).toBeVisible();
  });

  test('Filters sub-admins table by searching and role dropdown', async ({ page }) => {
    await page.goto('/admin-subadmins');

    // Test Search input
    const searchInput = page.locator('input[placeholder="Search sub-admin name or email..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Super');

    // Test Role Filter Select
    const roleSelect = page.locator('select').first();
    await expect(roleSelect).toBeVisible();
    await roleSelect.selectOption('super_admin');
  });

  test('Supports Promoting Registered Users and Organizers to Sub-Admins', async ({ page }) => {
    await page.goto('/admin-subadmins');

    // Click Provision / Promote Sub-Admin button
    const btn = page.getByRole('button', { name: 'Provision / Promote Sub-Admin' });
    await btn.click();

    // Switch to Promote Existing User tab in modal
    const promoteTabBtn = page.getByRole('button', { name: /Promote Existing User/i });
    await expect(promoteTabBtn).toBeVisible();
    await promoteTabBtn.click();

    // Verify candidate dropdown appears
    await expect(page.locator('text=Select Registered User / Organizer to Promote')).toBeVisible();
  });

});
