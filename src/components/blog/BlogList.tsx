import { PartialNotionBlog } from "@/types/notion.types";
import BlogCard from "./BlogCard";

type BlogListProps = {
  posts: PartialNotionBlog[];
};

const BlogList = ({ posts }: BlogListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-14">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
