import { expect, test, type Page } from "@playwright/test";

const DEMO_PAUSE_MS = 3500;
const KOREAN_STOCK_TICKER = "005930";
const DEMO_EMAIL = process.env.PLAYWRIGHT_DEMO_EMAIL ?? "user@example.com";
const DEMO_PASSWORD = process.env.PLAYWRIGHT_DEMO_PASSWORD ?? "Password123!";

async function showPage(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(DEMO_PAUSE_MS);
}

async function goToPage(page: Page, path: string) {
  await page.goto(path);
  await showPage(page);
}

async function pauseAfterAction(page: Page) {
  await page.waitForTimeout(DEMO_PAUSE_MS);
}

async function scrollTo(page: Page, top: number) {
  await page.evaluate((scrollTop) => {
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }, top);
  await pauseAfterAction(page);
}

test("WealthFlow 시연", async ({ page }) => {
  test.setTimeout(600_000);

  // 1. 로그인, 회원가입, 비밀번호 찾기 화면
  await goToPage(page, "/login");
  await page.getByRole("link", { name: "회원가입" }).click();
  await showPage(page);
  await goToPage(page, "/login");
  await page.getByRole("link", { name: "비밀번호 찾기" }).click();
  await showPage(page);
  await page.getByRole("link", { name: "로그인으로 돌아가기" }).click();
  await showPage(page);

  await page.locator("input#email").fill(DEMO_EMAIL);
  await pauseAfterAction(page);
  await page.locator("input#password").fill(DEMO_PASSWORD);
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL(/\/stocks/, { timeout: 15_000 });
  await showPage(page);

  // 2. 시장/거래 - 한국 주식만 탐색
  await page.getByRole("button", { name: "한국 주식" }).click();
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "종목명" }).click();
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "더보기" }).click();
  await pauseAfterAction(page);
  await scrollTo(page, 420);

  const favoriteButton = page.getByRole("button", { name: "관심 종목" }).first();
  if (await favoriteButton.isEnabled()) {
    await favoriteButton.click();
    await pauseAfterAction(page);
  }

  // 3. 관심종목
  await goToPage(page, "/favorites");
  await scrollTo(page, 280);

  // 4. 종목 상세 - 삼성전자(한국 주식)
  await goToPage(page, `/stock-detail/${KOREAN_STOCK_TICKER}`);
  await page.getByRole("button", { name: "1달" }).click();
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "3달" }).click();
  await pauseAfterAction(page);
  await scrollTo(page, 420);

  // 5. 매수 - 한국 주식만 실행
  await page.getByRole("link", { name: "구매하기" }).click();
  await showPage(page);
  await page.getByRole("button", { name: "1주" }).click();
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "구매하기" }).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 10_000 });
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "확인" }).click();
  await pauseAfterAction(page);

  // 6. 포트폴리오
  await goToPage(page, "/portfolio");
  await scrollTo(page, 360);
  await scrollTo(page, 720);

  // 7. 매도 - 한국 주식만 실행
  await goToPage(page, `/stock-detail/${KOREAN_STOCK_TICKER}`);
  await page.getByRole("link", { name: "판매하기" }).click();
  await showPage(page);
  await page.getByRole("button", { name: "1주" }).click();
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "판매하기" }).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 10_000 });
  await pauseAfterAction(page);
  await page.getByRole("button", { name: "확인" }).click();
  await pauseAfterAction(page);

  // 8. 거래 내역
  await goToPage(page, "/transactions");
  await scrollTo(page, 360);

  // 9. 환전 - 화면만 보여주고 환전 실행 및 환전 내역 이동은 하지 않음
  await goToPage(page, "/exchange");
  await expect(page).toHaveURL(/\/exchange$/);
  await scrollTo(page, 360);

  // 10. 랭킹
  await goToPage(page, "/ranking");
  await scrollTo(page, 420);

  // 11. 마이페이지와 내 랭킹 팝업
  await goToPage(page, "/my-page");
  await page.getByRole("button", { name: "내 랭킹" }).click();
  await pauseAfterAction(page);
  await page.keyboard.press("Escape");
  await pauseAfterAction(page);
  await scrollTo(page, 420);

  // 12. 내 정보 수정과 프로필 선택 - 저장은 실행하지 않음
  await goToPage(page, "/edit-info");
  await scrollTo(page, 560);
  await goToPage(page, "/profile");
  await scrollTo(page, 360);
});
