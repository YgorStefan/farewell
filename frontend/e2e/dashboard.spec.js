import { test, expect } from '@playwright/test';

test.describe('Dashboard de Velorios', () => {
  test('carrega o painel e lista velorios ativos', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Painel de Velórios e Sepultamentos/i })
    ).toBeVisible();

    const rows = page.locator('.row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('filtra por numero de Registro de Obito', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.row').first()).toBeVisible();

    await page.getByLabel(/Registro de Óbito/i).fill('REG-2026-0001');

    await expect(page.locator('.row')).toHaveCount(1);
    await expect(page.getByText('REG-2026-0001')).toBeVisible();
  });

  test('mostra estado vazio para registro inexistente', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/Registro de Óbito/i).fill('REG-NAO-EXISTE-999');

    await expect(
      page.getByText(/Nenhum atendimento para este registro/i)
    ).toBeVisible();
  });

  test('exporta o banner em PDF', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.row').first()).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Exportar Banner/i }).first().click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/banner-velorio-.*\.pdf/);
  });
});
