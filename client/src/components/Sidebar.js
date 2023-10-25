import React from "react";
import { Link } from "react-router-dom";
import { slugifyByHand } from "../ultils/helpers";
import icons from "../ultils/icons";
import { useSelector } from "react-redux";

const { MdArrowForwardIos } = icons;

const Sidebar = () => {
  const { categories } = useSelector((state) => state.appReducer);

  return (
    <div className="flex flex-col bg-white border rounded ">
      {categories?.map((element, index) => (
        <Link
          key={slugifyByHand(element.title)}
          to={slugifyByHand(element.title)}
          className={`px-3 pt-[4px] pb-[4px] justify-between flex flex-row items-center hover:bg-main hover:text-white ${
            index === 0 ? "rounded-t " : ""
          }${index === categories.length - 1 ? "rounded-b " : ""} `}
        >
          <span className="capitalize">{element.title}</span>
          <span className="text-[10px] ">
            <MdArrowForwardIos className="font-bold" />
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
