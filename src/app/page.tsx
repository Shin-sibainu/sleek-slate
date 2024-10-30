import BlogCard from "@/components/blog/BlogCard";
import BlogList from "@/components/blog/BlogList";
// import Pagination from "@/components/ui/Pagination";
import { getBlogPosts, getFeaturedPost } from "@/lib/notionDataFetcher";

const POSTS_PER_PAGE = 4;

export default async function Home() {
  const featuredPost = await getFeaturedPost();

  const {
    contents: posts,
    nextCursor,
    hasMore,
  } = await getBlogPosts({
    limit: POSTS_PER_PAGE,
    getTotalCount: true,
  });

  // console.log(posts);

  console.log(nextCursor, hasMore);

  // const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="my-10 max-w-3xl mx-auto">
      <div>
        <BlogCard post={featuredPost} variant="featured" />
      </div>

      <div className="my-10">
        <BlogList posts={posts} />
      </div>

      <div>{/* <Pagination currentPage={1} totalPages={totalPages} /> */}</div>
    </div>
  );
}
