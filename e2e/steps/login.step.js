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

When("I enter {string} in the username field", async function (username) {
  await page.fill('input[name="username"]', username);
});

When("I enter {string} in the password field", async function (password) {
  await page.fill('input[name="password"]', password);
});

When("I click the login button", async function () {
  await page.click('button[type="submit"]');
});

/* ---------------- THEN ---------------- */

Then("the login API should be called", async function () {
  await page.waitForRequest("**/auth/login");
});

Then(
  "the login API request should contain:",
  async function (dataTable) {
    const expected = dataTable.rowsHash();
    const actual = JSON.parse(lastLoginRequest.postData());

    expect(actual).toEqual(expected);
  }
);

Then("I should see the username field", async function () {
  await expect(page.locator('input[name="username"]')).toBeVisible();
});

Then("I should see the password field", async function () {
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

Then("I should see the login button", async function () {
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

Then(
  "the username field should contain {string}",
  async function (expectedValue) {
    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toHaveValue(expectedValue);
  }
);

Then(
  "the password field should contain {string}",
  async function (expectedValue) {
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveValue(expectedValue);
  }
);


