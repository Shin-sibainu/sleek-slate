import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getPostsByTag, getAllTags } from "@/lib/notionDataFetcher";
import { getCursorForPage } from "@/lib/cursorManager";
import { notFound } from "next/navigation";

export const revalidate = 10;

const POSTS_PER_PAGE = 6;

type Props = {
  params: {
    tag: string;
    page: string;
  };
};

export default async function TagPageWithPagination({ params }: Props) {
  const { tag, page } = params;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = Number(page);

  // ページ番号が不正な場合は404
  if (isNaN(currentPage)) {
    notFound();
  }

  const allTags = await getAllTags();
  const matchedTag = allTags.find(
    (t) => t.name.toLowerCase() === decodedTag.toLowerCase()
  );

  const cursor = await getCursorForPage(currentPage);

  const { contents, totalCount } = await getPostsByTag({
    tagName: matchedTag?.name || decodedTag,
    getTotalCount: true,
    limit: POSTS_PER_PAGE,
    startCursor: cursor,
    skipFirst: currentPage > 1, // ページ2以降の場合、最初の記事をスキップ
  });

  if (contents.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount! / POSTS_PER_PAGE);

  // ページ番号が総ページ数を超えている場合は404
  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        タグ「{decodedTag}」の記事一覧
        <span className="text-lg ml-4 text-gray-600">（{totalCount}件）</span>
      </h1>
      <BlogList posts={contents} />
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/tags/${tag}`}
        />
      </div>
    </div>
  );
}
