import { formatRelativeDate } from "@/lib/dateUtils";
import { PartialNotionBlog } from "@/types/notion.types";
import { truncateString } from "@/utils/stringUtils";
import { CalendarDateRangeIcon } from "@heroicons/react/16/solid";
import { Squares2X2Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  post: PartialNotionBlog | null | undefined;
  variant?: "featured" | "regular";
};

const BlogCard = ({ post, variant = "regular" }: BlogCardProps) => {
  const isFeatured = variant === "featured";

  if (!post) {
    return null; // または適切なローディング/エラー表示
  }

  return (
    <div
      className={`space-y-3 ${
        isFeatured ? "mx-auto" : "max-w-lg w-full mx-auto"
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block aspect-video">
        <div className="relative w-full h-0 pb-[56.25%]">
          <Image
            src={post.thumbnail || "/assets/sample-blog-thumbnail.png"}
            alt={post.title || "blog thumbnails"}
            fill
            className="object-cover duration-300 hover:scale-105 rounded-xl"
          />
        </div>
      </Link>
      <div className="flex items-center gap-6 text-slate-500 text-base">
        <div className="flex items-center gap-1">
          <UserCircleIcon className="size-5" />

          <Link href={"/about"} className="hover:text-teal-600 duration-150">
            ShinCode
          </Link>
        </div>
        <time>
          <div className="flex items-center gap-1">
            <CalendarDateRangeIcon className="size-5" />
            <span>{formatRelativeDate(post.date)}</span>
          </div>
        </time>

        <div className="flex items-center gap-1">
          <Squares2X2Icon className="size-5" />
          {post.categories.length > 0 ? (
            <Link
              href={`/categories/${post.categories[0].id}`}
              className="hover:text-teal-600 duration-150"
            >
              {post.categories[0].name}
            </Link>
          ) : (
            <span>未分類</span>
          )}
        </div>
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="inline-block hover:text-teal-600 duration-150"
      >
        <h3
          className={`${
            isFeatured ? "md:text-3xl" : "md:text-2xl"
          } font-medium`}
        >
          {post.title}
        </h3>
      </Link>
      <p className="text-slate-500">{truncateString(post.description, 60)}</p>
    </div>
  );
};

export default BlogCard;
