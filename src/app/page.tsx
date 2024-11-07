import BlogCard from "@/components/blog/BlogCard";
import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
// import Pagination from "@/components/ui/Pagination";
import { getBlogPosts, getFeaturedPost } from "@/lib/notionDataFetcher";
import { notFound } from "next/navigation";

export const revalidate = 10;

const FIRST_PAGE_POSTS = 4; // トップページの表示数
const OTHER_PAGES_POSTS = 6; // 2ページ目以降の表示数

export default async function Home() {
  const [featuredPost, blogData] = await Promise.all([
    getFeaturedPost(),
    getBlogPosts({
      limit: FIRST_PAGE_POSTS,
      getTotalCount: true,
    }),
  ]);

  const { contents: posts, totalCount } = blogData;

  // トップページは4件、2ページ目以降は6件ずつ表示する場合の総ページ数の計算
  const remainingPosts = totalCount! - FIRST_PAGE_POSTS; // 1ページ目に表示した分を引く
  const remainingPages = Math.ceil(
    Math.max(0, remainingPosts) / OTHER_PAGES_POSTS
  ); // 残りのページ数
  const totalPages = 1 + remainingPages; // 1ページ目 + 残りのページ数

  if (!posts) {
    notFound();
  }

  return (
    <div className="my-10 max-w-3xl mx-auto">
      <div>
        <BlogCard post={featuredPost} variant="featured" />
      </div>

      <div className="my-10">
        <BlogList posts={posts} />
      </div>

      <div>
        <Pagination currentPage={1} totalPages={totalPages} />
      </div>
    </div>
  );
}
