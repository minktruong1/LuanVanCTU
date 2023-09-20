import React from "react";
import { useSelector } from "react-redux";

const CategoriesList = () => {
  const { categories } = useSelector((state) => state.appReducer);
  console.log(categories);
  return (
    <>
      <div className="bg-white">
        <div className="p-[12px] text-xl">Danh mục</div>
        <div className="flex flex-wrap  justify-between ">
          {categories?.map((element) => (
            <div key={element._id} className="w-1/8 border cursor-pointer ">
              <div className="flex justify-center">
                <div className="p-[20px] ">
                  <img
                    alt=""
                    src={element.image}
                    className="w-[80px] h-[80px] "
                  />
                </div>
              </div>
              <div className="text-center mb-[8px]">{element.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesList;
