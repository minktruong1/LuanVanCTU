import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";

const { BsFillHouseFill } = icons;

const Breadcrumb = ({ title, category }) => {
  const routes = [
    { path: "/", breadcrumb: "Trang chủ" },
    { path: "/blogs", breadcrumb: "Tin tức" },
    { path: "/blogs/:bid/:title", breadcrumb: title },
    { path: "/all-products", breadcrumb: "Tất cả sản phẩm" },
    { path: "/main-cart", breadcrumb: "Giỏ hàng" },
    { path: "/coupons", breadcrumb: "Mã giảm giá" },
    { path: "/faqs", breadcrumb: "Hỏi đáp" },
    { path: "/:category", breadcrumb: category },
    { path: "/:category/:pid/:title", breadcrumb: title },
  ];

  const breadcrumb = useBreadcrumbs(routes);
  return (
    <div className="text-sm flex items-center whitespace-nowrap overflow-x-auto overflow-y-hidden my-4">
      {breadcrumb
        ?.filter((element) => !element.match.route === false)
        .map(({ match, breadcrumb }, index, count) => (
          <React.Fragment key={index}>
            <Link
              className="flex items-center text-canClick "
              to={match.pathname}
            >
              {index === 0 ? (
                <span className="text-[16px] flex capitalize">
                  <span className="mr-[4px] text-[17px] ">
                    <BsFillHouseFill />
                  </span>
                  {breadcrumb}
                </span>
              ) : (
                <>
                  {index !== count.length - 1 && (
                    <span className="text-[16px] flex items-center capitalize">
                      {breadcrumb}
                    </span>
                  )}
                </>
              )}
            </Link>
            {index !== count.length - 1 && (
              <span className="ml-[10px] mr-[10px] text-[11px]">{"/"}</span>
            )}
            {index === count.length - 1 && (
              <span className="text-[16px] text-[#6d6e72] capitalize ">
                {breadcrumb}
              </span>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default Breadcrumb;
