import React from "react";
import usePagination from "../hooks/usePagination";
import PageItems from "./PageItems";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, +params.get("page") || 1);
  return (
    <div className="flex gap-2">
      {pagination?.map((element) => (
        <PageItems key={element}>{element}</PageItems>
      ))}
    </div>
  );
};

export default Pagination;
