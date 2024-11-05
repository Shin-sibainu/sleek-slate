import PageHeader from "@/components/common/PageHeader";
import { getAllTags } from "@/lib/notionDataFetcher";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tags",
};

const Tags = async () => {
  const allTags = await getAllTags();

  return (
    <div className="mx-auto max-w-4xl text-center">
      <PageHeader title="Tags" />
      <div className="flex flex-wrap gap-6 justify-center">
        {allTags.map((tag) => (
          <Link
            href={`/tags/${tag.name.toLowerCase()}/page/1`}
            key={tag.id}
            className="bg-slate-200 px-4 py-2 rounded-md hover:bg-zinc-700 duration-150 hover:text-white"
          >
            # {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
