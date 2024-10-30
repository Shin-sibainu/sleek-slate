import React from "react";

type PageHeaderProps = {
  title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="my-10">
      <h2 className="md:text-4xl font-semibold text-center">{title}</h2>
      <div className="border-t-4 text-center w-[3rem] mx-auto mt-4 border-teal-500" />
    </div>
  );
};

export default PageHeader;
