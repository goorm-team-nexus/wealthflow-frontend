import { test } from "@playwright/test";

test("WealthFlow 시연", async ({ page }) => {
  // ── 1. 로그인 ──────────────────────────────────────────
  await page.goto("/login");
  await page.locator("input#email").fill("user@example.com");
  await page.locator("input#password").fill("Password123!");
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL(/\/(portfolio|stocks)/, { timeout: 15_000 });
  await page.waitForTimeout(1500);

  // ── 2. 주식 탐색 — 한국 주식 필터 ───────────────────────
  await page.goto("/stocks");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "한국 주식" }).click();
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 250));
  await page.waitForTimeout(1000);

  // ── 3. 종목 상세 (삼성전자) ─────────────────────────────
  await page.locator('a[href*="/stock-detail/005930"]').first().click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "1달" }).click();
  await page.waitForTimeout(1500);

  // ── 4. 관심 종목 추가 ────────────────────────────────────
  await page.getByRole("button", { name: "관심 종목" }).first().click();
  await page.waitForTimeout(1000);

  // ── 5. 매수 (10주) ──────────────────────────────────────
  await page.getByRole("link", { name: "구매하기" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "10주" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "구매하기" }).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 10_000 });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForTimeout(1000);

  // ── 6. 포트폴리오 확인 ──────────────────────────────────
  await page.goto("/portfolio");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1500);

  // ── 7. 매도 (5주) ───────────────────────────────────────
  await page.goto("/stock-detail/005930");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.getByRole("link", { name: "판매하기" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "5주" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "판매하기" }).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 10_000 });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "확인" }).click();
  await page.waitForTimeout(1000);

  // ── 8. 거래 내역 ────────────────────────────────────────
  await page.goto("/transactions");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // ── 9. 랭킹 ────────────────────────────────────────────
  await page.goto("/ranking");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1500);

  // ── 10. 마이페이지 ──────────────────────────────────────
  await page.goto("/my-page");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
});
