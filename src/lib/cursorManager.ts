import { getBlogPosts } from "./notionDataFetcher";

const POSTS_PER_PAGE = 4;
const cursorCache = new Map<number, string>();

export async function getCursorForPage(
  targetPage: number
): Promise<string | undefined> {
  if (targetPage <= 1) return undefined;

  // すでにキャッシュされているcursorがあれば使用
  if (cursorCache.has(targetPage)) {
    return cursorCache.get(targetPage);
  }

  let currentCursor: string | undefined | null = undefined;
  let currentPage = 1;

  // 目的のページまでcursorを収集
  while (currentPage < targetPage) {
    const { nextCursor } = await getBlogPosts({
      limit: POSTS_PER_PAGE,
      startCursor: currentCursor,
    });

    if (!nextCursor) break;

    currentCursor = nextCursor;
    cursorCache.set(currentPage + 1, nextCursor);
    currentPage++;
  }

  return currentCursor;
}
