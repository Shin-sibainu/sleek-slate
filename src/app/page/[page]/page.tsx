// import BlogList from "@/components/blog/BlogList";
// import Pagination from "@/components/ui/Pagination";
// import { Metadata } from "next";
// import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

// export async function generateMetadata({
//   params,
// }: {
//   params: { page: string };
// }): Promise<Metadata> {
//   const currentPage = Number(params.page);

//   return {
//     title: `${currentPage}ページ目`,
//   };
// }

// const POSTS_PER_PAGE = 4;

// const Page = async ({ params }: { params: { page: string } }) => {
//   const currentPage = Number(params.page);
//   const offset = (currentPage - 1) * POSTS_PER_PAGE + 1;

//   if (currentPage === 1) {
//     redirect("/");
//   }

//   const { contents: posts, totalCount } = await getBlogPosts({
//     limit: POSTS_PER_PAGE,
//     offset,
//   });

//   if (!posts.length) {
//     notFound();
//   }

//   const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

//   return (
//     <div className="my-10 max-w-3xl mx-auto">
//       <div>
//         <BlogList posts={posts} />
//       </div>

//       <div className="mt-8">
//         <Pagination currentPage={currentPage} totalPages={totalPages} />
//       </div>
//     </div>
//   );
// };

// export default Page;
import React from "react";

const Page = () => {
  return <div>Page</div>;
};

export default Page;
