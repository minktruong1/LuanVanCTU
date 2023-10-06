import { useMemo } from "react";
import { listPageRange } from "../ultils/helpers";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const usePagination = (numberOfProduct, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = process.env.REACT_APP_PRODUCT_LIMIT || 10;
    const paginationCount = Math.ceil(numberOfProduct / pageSize);
    const totalPagitaionItem = siblingCount + 5;

    if (paginationCount <= totalPagitaionItem) {
      return listPageRange(1, paginationCount);
    }

    const isShowLeftPage = currentPage - siblingCount > 2;
    const isShowRightPage = currentPage + siblingCount < paginationCount - 1;

    if (isShowLeftPage && !isShowRightPage) {
      const rightStart = paginationCount - 4;
      const rightRange = listPageRange(rightStart, paginationCount);

      return [1, <HiOutlineDotsHorizontal />, ...rightRange];
    }

    if (!isShowLeftPage && isShowRightPage) {
      const leftRange = listPageRange(1, 5);

      return [...leftRange, <HiOutlineDotsHorizontal />, paginationCount];
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);

    if (isShowLeftPage && isShowRightPage) {
      const middleRange = listPageRange(siblingLeft, siblingRight);
      return [
        1,
        <HiOutlineDotsHorizontal />,
        ...middleRange,
        <HiOutlineDotsHorizontal />,
        paginationCount,
      ];
    }
  }, [numberOfProduct, currentPage, siblingCount]);
  return paginationArray;
};

export default usePagination;
