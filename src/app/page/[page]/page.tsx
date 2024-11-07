import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getHomeCursorForPage } from "@/lib/cursorManager";
import { getBlogPosts } from "@/lib/notionDataFetcher";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 10;


// 定数定義
const FIRST_PAGE_POSTS = 4; // トップページの表示数
const OTHER_PAGES_POSTS = 6; // 2ページ目以降の表示数

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const currentPage = Number(params.page);

  return {
    title: `${currentPage}ページ目`,
  };
}

const Page = async ({ params }: { params: { page: string } }) => {
  const currentPage = Number(params.page);

  if (currentPage === 1) {
    redirect("/");
  }

  // getHomeCursorForPage を使用してカーソルを取得
  const cursor = await getHomeCursorForPage(currentPage);

  // 記事を取得
  const { contents: posts, totalCount } = await getBlogPosts({
    limit: OTHER_PAGES_POSTS,
    startCursor: cursor,
    getTotalCount: true,
  });

  if (!posts || posts.length === 0) {
    notFound();
  }

  // 総ページ数の計算
  // フィーチャー記事を除外した総記事数から計算
  const remainingPosts = Math.max(0, totalCount! - FIRST_PAGE_POSTS - 1); // フィーチャー記事と1ページ目の4件を引く
  const remainingPages = Math.ceil(remainingPosts / OTHER_PAGES_POSTS); // 残りのページ数（6件ずつ）
  const totalPages = 1 + remainingPages; // 1ページ目 + 残りのページ数

  // 現在のページが総ページ数を超えている場合は404
  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <div className="my-10 max-w-3xl mx-auto">
      <div>
        <BlogList posts={posts} />
      </div>

      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Page;
