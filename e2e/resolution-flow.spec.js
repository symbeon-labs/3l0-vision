import { test, expect } from "@playwright/test";

test("RESOLVED: demo identifier is resolved through API v1", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Usar EAN de demonstração|Consultar catálogo/ }).count();
  await page.locator("#use-demo").click();
  await expect(page.getByText("API V1")).toBeVisible();
  await expect(page.getByText("RESOLVIDO", { exact: true })).toBeVisible();
  await expect(page.getByText("Produto X")).toBeVisible();
});

test("UNCERTAIN: unknown identifier remains an explicit uncertain result", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Identificar item/ }).click();
  await page.locator("#code").fill("unknown-123");
  await page.locator("#manual-form button[type=submit]").click();
  await expect(page.getByText("API V1")).toBeVisible();
  await expect(page.getByText("INCERTO", { exact: true })).toBeVisible();
  await expect(page.getByText("Sem correspondência suficiente.")).toBeVisible();
});

test("CONFLICT: UI presents a conflict without choosing a candidate", async ({ page }) => {
  await page.route("**/api/v1/resolve", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        apiVersion: "v1",
        resolutionId: "res_e2e_conflict",
        status: "CONFLICT",
        state: "CONFLICT",
        observation: { identifiers: [{ scheme: "ean", value: "789000000004" }] },
        result: {
          resolution_id: "res_e2e_conflict",
          status: "CONFLICT",
          entities: [],
          conflicts: [{ type: "multiple_entity_matches", candidates: ["product_a", "product_b"] }],
          uncertainties: [],
          provenance: []
        },
        limitations: ["synthetic test response"]
      })
    });
  });
  await page.goto("/");
  await page.locator("#use-demo").click();
  await expect(page.getByText("API V1")).toBeVisible();
  await expect(page.getByText("CONFLITO", { exact: true })).toBeVisible();
  await expect(page.getByText("Há um conflito.")).toBeVisible();
  await expect(page.getByText("Nenhuma identidade confirmada")).toBeVisible();
});

test("API outage uses the clearly labeled local fallback", async ({ page }) => {
  await page.route("**/api/v1/resolve", (route) => route.abort());
  await page.goto("/");
  await page.locator("#use-demo").click();
  await expect(page.getByText("FALLBACK LOCAL")).toBeVisible();
  await expect(page.getByText("RESOLVIDO", { exact: true })).toBeVisible();
});
