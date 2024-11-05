import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getPostsByTag, getAllTags } from "@/lib/notionDataFetcher";
import { notFound } from "next/navigation";
import { getCursorForPage } from "@/lib/cursorManager";

export const revalidate = 10;

const POSTS_PER_PAGE = 6;

type Props = {
  params: {
    tag: string;
  };
  searchParams: {
    page?: string;
  };
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.name,
  }));
}

export default async function TagPage({ params, searchParams }: Props) {
  const { tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = Number(searchParams.page) || 1;

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
  });

  if (contents.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount! / POSTS_PER_PAGE);

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
