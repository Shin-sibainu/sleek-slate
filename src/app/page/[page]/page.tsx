import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getCursorForPage } from "@/lib/cursorManager";
import { getBlogPosts } from "@/lib/notionDataFetcher";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// export const runtime = "edge";

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

const POSTS_PER_PAGE = 4;

const Page = async ({ params }: { params: { page: string } }) => {
  const currentPage = Number(params.page);

  if (currentPage === 1) {
    redirect("/");
  }

  // 現在のページに対応するcursorを取得して、そのページの記事を取得
  const cursor = await getCursorForPage(currentPage);
  const { contents: posts, totalCount } = await getBlogPosts({
    limit: POSTS_PER_PAGE,
    startCursor: cursor,
    getTotalCount: true,
  });

  const totalPages = Math.ceil(totalCount! / POSTS_PER_PAGE);

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
