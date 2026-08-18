import { expect, test, type Page } from "@playwright/test";

async function chooseCountry(page: Page, index: number, name: string) {
  const field = page.getByRole("combobox").nth(index);
  await field.fill(name);
  await page.getByRole("option", { name: new RegExp(`${name} [A-Z]{2}`) }).click();
}

test("completes and swaps a comparison", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Does your charger work abroad? Check before you fly." })).toBeVisible();
  await expect(page.locator(".hero-desk-globe")).toBeVisible();

  await chooseCountry(page, 0, "United Kingdom");
  await chooseCountry(page, 1, "Japan");
  await expect(page).toHaveURL(/\/compare\/united-kingdom\/japan$/);
  await expect(page.getByRole("heading", { name: "A voltage converter may be required" })).toBeVisible();

  await page.getByText("Change or swap countries").click();
  await page.getByRole("button", { name: "Swap countries" }).click();
  await expect(page).toHaveURL(/\/compare\/japan\/united-kingdom$/);
});

test("supports search, the globe list, and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const animationDuration = await page.locator(".hero-desk-globe__land").evaluate(
    (element) => getComputedStyle(element).animationDuration,
  );
  expect(Number.parseFloat(animationDuration)).toBeLessThan(0.001);

  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("searchbox", { name: "Search countries and plug types" }).fill("Japan");
  await expect(page.getByRole("link", { name: /^Japan Types A, B/ })).toBeVisible();
  await page.getByRole("button", { name: "Close search" }).click();

  await page.getByRole("button", { name: /Explore destinations Open Globe view/ }).click();
  await expect(page.getByRole("dialog", { name: "Choose a destination" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Afghanistan" })).toBeVisible();
  await page.getByRole("button", { name: "Close globe view" }).click();
  await expect(page.getByRole("dialog", { name: "Choose a destination" })).toBeHidden();
});

test("checks a device and exposes trust links", async ({ page }) => {
  await page.goto("/device-checker");
  await chooseCountry(page, 0, "United Kingdom");
  await chooseCountry(page, 1, "Japan");
  await page.getByRole("radio", { name: "Phone charger" }).check();
  await page.getByRole("button", { name: "Check this device" }).click();
  await expect(page.getByRole("heading", { name: /United Kingdom to.*Japan/ })).toBeVisible();

  await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/sa1755/travel-plug-comparison",
  );
  await expect(page.getByRole("link", { name: /Electrical data sources/ })).toBeVisible();
});
