import { formatRelativeDate } from "@/lib/dateUtils";

import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import { CalendarDateRangeIcon } from "@heroicons/react/16/solid";
import { Squares2X2Icon, UserCircleIcon } from "@heroicons/react/24/outline";

import StyledContent from "@/components/common/StyledContent";
import {
  getBlogPosts,
  getDetailPost,
  getFeaturedPost,
} from "@/lib/notionDataFetcher";

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const post = await getDetailPost(slug);

  const { title, description, thumbnail } = post.metadata;

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: thumbnail!,
          height: 1280,
          width: 630,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const featuredPost = await getFeaturedPost();
  const { contents: posts } = await getBlogPosts({ limit: 10 });

  // featuredPostが存在する場合はそのslugを取得
  const featuredPostSlug = featuredPost ? { slug: featuredPost.slug } : null;

  // 通常の記事のslugsを配列として取得
  const postSlugs = posts.map((post) => ({
    slug: post.slug,
  }));

  // nullを除外しながら配列を結合
  const allSlugs = featuredPostSlug
    ? [...postSlugs, featuredPostSlug]
    : postSlugs;

  return allSlugs;
}

const BlogDetailPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const post = await getDetailPost(slug);

  const { title, thumbnail, categories, date } = post.metadata;
  const markdown = post.markdown;

  return (
    <div className="flex flex-col items-center md:my-16 space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
      </div>

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
            <span>{formatRelativeDate(date)}</span>
          </div>
        </time>

        <div className="flex items-center gap-1">
          <Squares2X2Icon className="size-5" />
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.name}`}
              className="hover:text-teal-600 duration-150"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full">
        <Image
          src={thumbnail || "/sample.jpg"}
          alt={title || "post eye catch"}
          width={1200}
          height={630}
          className="object-cover rounded-xl"
        />
      </div>

      <StyledContent content={markdown} />
    </div>
  );
};

export default BlogDetailPage;
