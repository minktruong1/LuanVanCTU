import React from "react";
import usePagination from "../hooks/usePagination";
import PageItems from "./PageItems";

const Pagination = ({ totalCount }) => {
  const pagination = usePagination(totalCount);
  return (
    <div className="flex gap-2">
      {pagination?.map((element) => (
        <PageItems key={element}>{element}</PageItems>
      ))}
    </div>
  );
};

export default Pagination;
