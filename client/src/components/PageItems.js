import React, { useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
  useParams,
  createSearchParams,
} from "react-router-dom";
import clsx from "clsx";

const PageItems = ({ children = 1 }) => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [params] = useSearchParams();

  const handlePagination = () => {
    let newParam = [];
    for (let i of params.entries()) {
      newParam.push(i);
    }
    const queries = {};
    for (let i of newParam) {
      queries[i[0]] = i[1];
    }

    if (Number(children)) {
      queries.page = children;
    }

    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  };
  return (
    <button
      className={clsx(
        "flex border w-[34px] h-[34px] justify-center",
        Number(children) && "items-center",
        !Number(children) && "items-end",
        +params.get("page") === +children
          ? "bg-main text-white"
          : "bg-white text-black hover:bg-[#ccc]",
        !+params.get("page") && +children === 1 && "!bg-main !text-white "
      )}
      onClick={handlePagination}
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default PageItems;
