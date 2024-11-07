import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getPostsByCategory, getAllCategories } from "@/lib/notionDataFetcher";
import { getCategoryPageCursor } from "@/lib/cursorManager";
import { notFound } from "next/navigation";

export const revalidate = 10;

const POSTS_PER_PAGE = 6;

type Props = {
  params: {
    category: string;
    page: string;
  };
};

export default async function CategoryPageWithPagination({ params }: Props) {
  const { category, page } = params;
  const decodedCategory = decodeURIComponent(category);
  const currentPage = Number(page);

  if (isNaN(currentPage)) {
    notFound();
  }

  const allCategories = await getAllCategories();
  const matchedCategory = allCategories.find(
    (c) => c.name.toLowerCase() === decodedCategory.toLowerCase()
  );

  const cursor = await getCategoryPageCursor(
    currentPage,
    matchedCategory?.name || decodedCategory
  );

  const { contents, totalCount } = await getPostsByCategory({
    categoryName: matchedCategory?.name || decodedCategory,
    getTotalCount: true,
    limit: POSTS_PER_PAGE,
    startCursor: cursor,
  });

  if (contents.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount! / POSTS_PER_PAGE);

  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        カテゴリー「{decodedCategory}」の記事一覧
        <span className="text-lg ml-4 text-gray-600">（{totalCount}件）</span>
      </h1>
      <BlogList posts={contents} />
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/categories/${category}`}
        />
      </div>
    </div>
  );
}
