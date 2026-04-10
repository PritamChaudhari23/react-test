import {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} from "@cucumber/cucumber";

import { chromium, expect } from "@playwright/test";

setDefaultTimeout(60 * 1000);

let page, browser, context, lastLoginRequest;

/* ---------------- HOOKS ---------------- */

Before(async function () {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();

  // Intercept login API
  await context.route("**/auth/login", async route => {
    lastLoginRequest = route.request();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "fake-token" }),
    });
  });

  page = await context.newPage();
});

After(async function () {
  await page.close();
  await context.close();
  await browser.close();
});

/* ---------------- GIVEN ---------------- */

Given("I am on the login page", async function () {
  await page.goto("http://localhost:5173");
});

/* ---------------- WHEN ---------------- */

When("I enter {string} in the {string} field", async function (fieldValue, fieldName) {
  await page.fill(`input[name=${fieldName}]`, fieldValue);
});

When("I click the login button", async function () {
  await page.click('button[type="submit"]');
});

/* ---------------- THEN ---------------- */

Then("I should see the {string} field", async function (fieldName) {
  await expect(page.locator(`input[name=${fieldName}]`)).toBeVisible();
});

Then("I should see the login button", async function () {
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

Then("The {string} field should contain {string}", async function (fieldName, expectedValue) {
    const inputField = page.locator(`input[name=${fieldName}]`);
    await expect(inputField).toHaveValue(expectedValue);
});

Then("The login API should be called", async function () {
  await page.waitForRequest("**/auth/login");
});

Then("The login API request should contain:", async function (dataTable) {
    const expected = dataTable.rowsHash();
    const actual = JSON.parse(lastLoginRequest.postData());
    expect(actual).toEqual(expected);
  }
);