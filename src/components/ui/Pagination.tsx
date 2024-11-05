import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { ReactNode } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "",
}: PaginationProps) {
  const pageNumbers = [];
  const maxVisiblePages = 5; // 表示するページ数の最大値

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const PageLink = ({
    page,
    children,
  }: {
    page: number;
    children: ReactNode;
  }) => (
    <Link
      href={basePath === "" && page === 1 ? "/" : `${basePath}/page/${page}`}
      className={`border px-4 py-2 rounded-lg hover:bg-zinc-700 hover:text-white duration-150 ${
        currentPage === page ? "bg-zinc-700 text-white" : "border-zinc-700"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="flex items-center justify-center gap-3">
      {currentPage > 1 && (
        <PageLink page={currentPage - 1}>
          <ArrowLeftIcon className="size-6" />
        </PageLink>
      )}
      <div className="flex items-center gap-3">
        {pageNumbers.map((number) => (
          <PageLink key={number} page={number}>
            {number}
          </PageLink>
        ))}
      </div>
      {currentPage < totalPages && (
        <PageLink page={currentPage + 1}>
          <ArrowRightIcon className="size-6" />
        </PageLink>
      )}
    </div>
  );
}
