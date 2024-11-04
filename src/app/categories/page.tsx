import PageHeader from "@/components/common/PageHeader";
import { getAllCategories } from "@/lib/notionDataFetcher";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
};

const Categories = async () => {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl text-center">
      <PageHeader title="Categories" />
      <div className="flex flex-wrap gap-6 justify-center">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.name.toLowerCase()}`}
            key={category.id}
            className="bg-slate-200 px-4 py-2 rounded-md hover:bg-zinc-700 duration-150 hover:text-white"
          >
            # {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
