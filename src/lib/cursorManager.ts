import { getBlogPosts, getPostsByCategory } from "./notionDataFetcher";

const HOME_POSTS_PER_PAGE = 4;
const CATEGORY_POSTS_PER_PAGE = 6;

const homeCursorCache = new Map<number, string>();
const categoryCursorCache = new Map<string, string>();

export async function getCategoryPageCursor(
  targetPage: number,
  categoryName: string
): Promise<string | undefined> {
  if (targetPage <= 1) return undefined;

  const cacheKey = `${categoryName}-${targetPage}`;

  if (categoryCursorCache.has(cacheKey)) {
    return categoryCursorCache.get(cacheKey);
  }

  let currentCursor: string | undefined | null = undefined;
  let currentPage = 1;

  while (currentPage < targetPage) {
    const { nextCursor } = await getPostsByCategory({
      categoryName,
      limit: CATEGORY_POSTS_PER_PAGE,
      startCursor: currentCursor,
    });

    if (!nextCursor) break;

    currentCursor = nextCursor;
    const currentCacheKey = `${categoryName}-${currentPage + 1}`;
    categoryCursorCache.set(currentCacheKey, nextCursor);
    currentPage++;
  }

  return currentCursor;
}

export async function getHomeCursorForPage(
  targetPage: number
): Promise<string | undefined> {
  if (targetPage <= 1) return undefined;

  if (homeCursorCache.has(targetPage)) {
    return homeCursorCache.get(targetPage);
  }

  let currentCursor: string | undefined | null = undefined;
  let postsToSkip = HOME_POSTS_PER_PAGE; // 最初の4件をスキップ

  // 2ページ目以降の分を計算
  if (targetPage > 2) {
    // 2ページ目以降の完全なページ分を追加（6件ずつ）
    postsToSkip += CATEGORY_POSTS_PER_PAGE * (targetPage - 2);
  }

  let postsSkipped = 0;

  while (postsSkipped < postsToSkip) {
    const { contents, nextCursor } = await getBlogPosts({
      limit: Math.min(100, postsToSkip - postsSkipped),
      startCursor: currentCursor,
    });

    if (!nextCursor || contents.length === 0) break;

    postsSkipped += contents.length;
    currentCursor = nextCursor;

    // 現在の進捗に基づいてページ番号を計算
    if (postsSkipped >= HOME_POSTS_PER_PAGE) {
      const currentPage =
        Math.floor(
          (postsSkipped - HOME_POSTS_PER_PAGE) / CATEGORY_POSTS_PER_PAGE
        ) + 2;
      homeCursorCache.set(currentPage, nextCursor);
    }
  }

  return currentCursor;
}

// 後方互換性のために元の関数名でexport
export const getCursorForPage = getHomeCursorForPage;
