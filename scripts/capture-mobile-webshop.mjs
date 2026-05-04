/**
 * Mobile webshop screenshots (Playwright) — zelfde doel als Cursor Playwright MCP.
 * Gebruik: npm run screenshots:mobile
 * Optioneel: BASE_URL=http://localhost:3000 npm run screenshots:mobile
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "screenshots", "mobile-webshop");
const BASE = (process.env.BASE_URL || "https://bikerfun.nl").replace(/\/$/, "");

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // 1) Webshop producten
  await page.goto(`${BASE}/products`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(outDir, "01-products-viewport.png"), timeout: 60_000 });
  await page.screenshot({
    path: path.join(outDir, "01-products-fullpage.png"),
    fullPage: true,
    timeout: 180_000,
    animations: "disabled",
  });

  // 2) Winkelwagen
  await page.goto(`${BASE}/cart`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(outDir, "02-cart-fullpage.png"),
    fullPage: true,
    timeout: 120_000,
    animations: "disabled",
  });

  // 3) Nav open (MENU)
  await page.goto(`${BASE}/products`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(1000);
  const menuByRole = page.getByRole("button", { name: /menu/i }).first();
  if (await menuByRole.isVisible().catch(() => false)) {
    await menuByRole.click();
  } else {
    await page.locator("button:has-text('MENU')").first().click();
  }
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outDir, "03-slide-menu-open.png"),
    fullPage: true,
    timeout: 120_000,
    animations: "disabled",
  });

  // 4) Checkout (header + formulier bovenkant)
  await page.goto(`${BASE}/checkout`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(outDir, "04-checkout-viewport.png"),
    timeout: 60_000,
  });

  await browser.close();
  console.log(`Screenshots geschreven naar: ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
