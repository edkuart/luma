import { expect, test } from "@playwright/test";
import { config } from "dotenv";

config({ path: ".env.local" });

const baseUrl = "http://localhost:3000";
const outputDir = "review-screenshots";

async function settleVisualState(page: import("@playwright/test").Page) {
  await page.waitForTimeout(900);
}

async function loginAsAdmin(page: import("@playwright/test").Page) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar en .env.local");
  }

  await page.goto(`${baseUrl}/admin/login`);
  await page.getByLabel("Correo admin").fill(email);
  await page.getByLabel("Contrasena").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(`${baseUrl}/admin`);
}

test.describe("Luma visual review", () => {
  test("desktop public and admin", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });

    await page.goto(baseUrl);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/01-public-home-desktop.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/proyectos`);
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/02-public-projects-desktop.png`,
      fullPage: true,
    });

    await loginAsAdmin(page);
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/03-admin-dashboard-desktop.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/admin/home`);
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/04-admin-home-desktop.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/admin/media`);
    await expect(page.getByRole("heading", { name: "Media" })).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/05-admin-media-desktop.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/admin/appearance`);
    await expect(
      page.getByRole("heading", { name: "Apariencia" }),
    ).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/06-admin-appearance-desktop.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/admin/proyectos/nuevo`);
    await expect(
      page.getByRole("heading", { name: "Nuevo proyecto" }),
    ).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/10-admin-new-project-desktop.png`,
      fullPage: true,
    });
  });

  test("mobile public and admin navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });

    await page.goto(baseUrl);
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/07-public-home-mobile.png`,
      fullPage: true,
    });

    await loginAsAdmin(page);
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(
      page.getByRole("button", { name: "General Vista rapida" }),
    ).toBeVisible();
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/08-admin-mobile-menu.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/admin/home`);
    await settleVisualState(page);
    await page.screenshot({
      path: `${outputDir}/09-admin-home-mobile.png`,
      fullPage: true,
    });
  });
});
