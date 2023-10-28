import React, { useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
  useLocation,
} from "react-router-dom";
import clsx from "clsx";

const PageItems = ({ children }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  const handlePagination = () => {
    const queries = Object.fromEntries([...params]);
    console.log(queries);
    if (Number(children)) {
      queries.page = children;
    }
    navigate({
      pathname: location.pathname,
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
