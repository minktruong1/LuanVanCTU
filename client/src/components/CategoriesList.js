import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { slugifyByHand } from "../ultils/helpers";

const CategoriesList = () => {
  const { categories } = useSelector((state) => state.appReducer);
  return (
    <>
      <div className="bg-white w-[calc(100%-20px)] md:w-full ">
        <div className="p-[12px] text-xl hidden md:block">Danh mục</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categories?.map((element) => (
            <Link
              to={`/categories/${slugifyByHand(element.title)}`}
              key={element._id}
              className="cursor-pointer "
            >
              <div className="flex justify-center">
                <div className="p-[20px] ">
                  <img
                    alt=""
                    src={element.image}
                    className="w-[40px] h-[40px] md:w-[70px] md:h-[70px]"
                  />
                </div>
              </div>
              <div className="text-center mb-[8px] capitalize text-xs md:text-base">
                {element.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesList;
