import { test, expect } from '@playwright/test';
test('réservation complète', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name=email]', 'test@test.com');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/sessions');
});