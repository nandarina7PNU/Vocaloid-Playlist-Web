import { test, expect, type Page } from '@playwright/test';

async function openLibrary(page: Page, label: string) {
  const menu = page.getByRole('button', { name: '메뉴 열기', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('navigation', { name: '내 라이브러리', exact: true })
    .getByRole('button', { name: label, exact: true })
    .click();
}

test.beforeEach(async ({ page }) => {
  // Keep UI tests independent of third-party media availability.
  await page.route('https://i.ytimg.com/**', (route) => route.abort());
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.abort());
  await page.goto('/home');
});

test('소개 페이지와 서비스 진입 경로', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole('heading', { name: /좋아한 이유를 이해하고.*Vocaloid 추천/ }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '무엇이 다를까요?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '추천은 이렇게 이루어져요' })).toBeVisible();
  await expect(page.getByText('콜드 스타트 대응', { exact: true })).toBeVisible();
  await expect(page.getByText('숨은 명곡 발견', { exact: true })).toBeVisible();
  await expect(page.locator('.landing-feature-card')).toHaveCount(6);
  await expect(page.locator('.landing-step')).toHaveCount(6);
  await expect(page.locator('.landing-screen')).toHaveCount(5);
  await expect(
    page.getByRole('navigation', { name: '소개 페이지 위치' }).getByRole('link'),
  ).toHaveCount(5);
  expect(
    await page
      .locator('.landing-page')
      .evaluate((element) => getComputedStyle(element).scrollSnapType),
  ).toContain('y mandatory');
  const railSpacing = await page.evaluate(() => {
    const rail = document.querySelector('.landing-page-dots')?.getBoundingClientRect();
    const content = document.querySelector('.landing-hero-copy')?.getBoundingClientRect();
    return rail && content ? { railRight: rail.right, contentLeft: content.left } : null;
  });
  expect(railSpacing).not.toBeNull();
  expect(railSpacing!.railRight).toBeLessThan(railSpacing!.contentLeft);
  await expect(page.getByRole('link', { name: /취향 분석 시작하기/ })).toHaveAttribute(
    'href',
    '/home',
  );
  await page.getByRole('link', { name: '4번째 화면: 추천 과정' }).click();
  await expect(page).toHaveURL(/\/about#flow$/);
  await expect(page.getByRole('link', { name: '4번째 화면: 추천 과정' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('홈 화면과 반응형 레이아웃', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /당신의 취향을 더 잘 이해하는/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: '지금, 당신을 위한 추천곡' })).toBeVisible();
  await expect(page.locator('.song-card')).toHaveCount(6);
  await expect(page.locator('.hero-image')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('.hero-image').evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByRole('img', { name: /샘플 취향 차트/ })).toBeVisible();
  await expect(page.getByRole('link', { name: '취향 프로필', exact: true })).toHaveAttribute(
    'href',
    '/mypage',
  );
});

test('마이페이지 더미 데이터와 주요 카드 배치', async ({ page }) => {
  await page.goto('/mypage');
  await expect(page.getByRole('heading', { name: '마이페이지', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '취향 진단 결과' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '최근 들은 곡' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '최근 평가한 곡' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '내 플레이리스트' })).toBeVisible();
  await expect(page.locator('.mypage-summary h2')).toContainText('미쿠_팬');
  await expect(page.locator('.mypage-card-name')).toHaveText('미쿠_팬');
  await expect(page.getByRole('img', { name: /취향 진단 결과/ })).toHaveCount(2);
  await expect(page.getByRole('img', { name: /구성 69점/ }).first()).toBeVisible();
  await page.getByRole('button', { name: '프로필 카드 전체 보기' }).click();
  const profileCard = page.getByRole('dialog', { name: '미쿠_팬' });
  await expect(profileCard).toBeVisible();
  expect(await profileCard.evaluate((card) => card.scrollHeight <= card.clientHeight)).toBe(true);
  await expect(profileCard).toContainText('VPW-7A39-MK01');
  await expect(profileCard).toContainText('취향 키워드');
  await expect(profileCard).toContainText('좋아하는 프로듀서');
  await expect(profileCard).toContainText('최애곡');
  await expect(profileCard).toContainText('플레이리스트');
  await profileCard.getByRole('button', { name: '프로필 카드 닫기' }).click();
  await expect(profileCard).not.toBeVisible();
  await expect(page.getByRole('button', { name: '프로필 카드 공유하기' })).toBeVisible();
  await expect(page.locator('.mypage-song-list article')).toHaveCount(3);
  await expect(page.locator('.mypage-rating-list article')).toHaveCount(3);
  await expect(page.locator('.mypage-playlist-list article')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('프로필 카드가 작은 화면에서도 잘리거나 겹치지 않음', async ({ page }) => {
  await page.goto('/mypage');
  await page.getByRole('button', { name: '프로필 카드 전체 보기' }).click();
  const card = page.getByRole('dialog', { name: '미쿠_팬' });
  await expect(card).toBeVisible();

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 700, height: 600 },
    { width: 900, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(
        () =>
          card.evaluate((element) => {
            const cardBounds = element.getBoundingClientRect();
            const regions = [...element.children].map((child) => child.getBoundingClientRect());
            const overflowing = [...element.querySelectorAll('*')].some(
              (child) =>
                child instanceof HTMLElement &&
                child.clientWidth > 0 &&
                child.scrollWidth > child.clientWidth + 1,
            );
            return {
              fitsViewport:
                cardBounds.top >= 0 &&
                cardBounds.left >= 0 &&
                cardBounds.bottom <= innerHeight &&
                cardBounds.right <= innerWidth,
              noInternalScroll: element.scrollHeight <= element.clientHeight + 1,
              regionsDoNotOverlap: regions.every((region, index) =>
                regions
                  .slice(index + 1)
                  .every(
                    (other) =>
                      region.right <= other.left + 1 ||
                      other.right <= region.left + 1 ||
                      region.bottom <= other.top + 1 ||
                      other.bottom <= region.top + 1,
                  ),
              ),
              contentFits: !overflowing,
            };
          }),
        { message: `${viewport.width}×${viewport.height}에서 프로필 카드 배치` },
      )
      .toEqual({
        fitsViewport: true,
        noInternalScroll: true,
        regionsDoNotOverlap: true,
        contentFits: true,
      });
  }

  await page.keyboard.press('Escape');
  await expect(card).not.toBeVisible();
});

test('검색과 취향 필터, 검색 결과 없음', async ({ page }) => {
  const search = page.getByRole('textbox', { name: '곡, 프로듀서, 보컬로이드 검색' });
  await search.fill('DECO*27');
  await expect(page.locator('.song-card')).toHaveCount(2);
  await search.fill('찾을수없는곡');
  await expect(page.getByRole('heading', { name: '일치하는 곡을 찾지 못했어요' })).toBeVisible();
  await page.getByRole('button', { name: '필터 초기화', exact: true }).click();
  await expect(page.locator('.song-card')).toHaveCount(6);
  await page
    .locator('.discovery-tags')
    .getByRole('button', { name: '빠른 전개', exact: true })
    .click();
  await expect(page.locator('.song-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '빠른 전개, 이런 곡은 어때요?' })).toBeVisible();
});

test('곡 저장이 새로고침 뒤에도 유지되고 라이브러리에 표시', async ({ page }) => {
  await page.getByRole('button', { name: 'ヒバナ (Hibana) 저장', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('좋아요한 곡에 저장');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'ヒバナ (Hibana) 저장 취소', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await openLibrary(page, '좋아요한 곡 1');
  await expect(page.locator('.song-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'ヒバナ (Hibana) 저장 취소', exact: true }).click();
  await expect(page.getByRole('heading', { name: '좋아하는 곡을 모아 보세요' })).toBeVisible();
});

test('공식 영상 재생 창과 재생 기록', async ({ page }) => {
  await page.getByRole('button', { name: 'ヒバナ (Hibana) 재생', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/hxSg2Ioz3LM?autoplay=1',
  );
  await expect(dialog.getByRole('link', { name: 'YouTube에서 보기' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=hxSg2Ioz3LM',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(dialog.locator('iframe')).toHaveCount(0);
  await openLibrary(page, '최근 들은 곡');
  await expect(page.locator('.song-card')).toHaveCount(1);
});

test('플레이리스트 생성 및 중복 이름 방지', async ({ page }) => {
  const menu = page.getByRole('button', { name: '메뉴 열기', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('button', { name: '플레이리스트 만들기', exact: true }).click();
  await page.getByRole('textbox', { name: '플레이리스트 이름' }).fill('밤 산책');
  await page.getByRole('button', { name: '만들기', exact: true }).click();
  await expect(page.locator('.playlist-list')).toContainText('밤 산책');
  await page.reload();
  await openLibrary(page, '내 플레이리스트');
  await expect(page.locator('.playlist-list')).toContainText('밤 산책');
  await page.getByRole('button', { name: '새 플레이리스트', exact: true }).click();
  await page.getByRole('textbox', { name: '플레이리스트 이름' }).fill('밤 산책');
  await page.getByRole('button', { name: '만들기', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('같은 이름');
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('프로필과 공유 창에 샘플·공개 범위 안내', async ({ page }) => {
  await page.getByRole('button', { name: '내 취향 한눈에 보기' }).click();
  await expect(page.getByRole('dialog')).toContainText('현재는 예시예요');
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await page.locator('.share-panel').click();
  await expect(page.getByRole('button', { name: '곡 목록 복사하기' })).toBeDisabled();
  await expect(page.getByRole('dialog')).toContainText('재생 기록은 포함하지 않아요');
});
