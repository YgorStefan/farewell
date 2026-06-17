import { test, expect } from '@playwright/test';

test.describe('Regressao visual', () => {
  test('cabecalho (marca) permanece estavel', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('.header__brand');
    await expect(brand).toBeVisible();
    await expect(brand).toHaveScreenshot('header-brand.png');
  });

  test('estado vazio permanece estavel', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/Registro de Óbito/i).fill('REG-NAO-EXISTE-999');
    await expect(page.getByText(/Nenhum atendimento para este registro/i)).toBeVisible();

    await expect(page).toHaveScreenshot('empty-state.png', {
      mask: [page.locator('.header__status')],
      fullPage: true,
    });
  });
});
