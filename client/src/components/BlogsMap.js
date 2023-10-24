import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import path from "../ultils/path";

const reactSlickSetting = {
  dot: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const BlogsMap = () => {
  const { blogList } = useSelector((state) => state.blogReducer);

  return (
    <>
      <div className="bg-white w-[380px] md:w-full p-4 ">
        <div className="text-xl hidden md:flex justify-between items-center">
          <span>Tin tức công nghệ</span>
          <Link
            to={`/${path.BLOGS}`}
            className="text-sm text-canClick cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 ">
          <div className="w-full mt-4">
            <Slider
              {...reactSlickSetting}
              className="product-detail-slick flex gap-2 justify-between "
            >
              {blogList?.map((element) => (
                <>
                  <div>
                    <img alt="" src={element.image} className="w-[276px]" />
                  </div>
                  <span className="line-clamp-2 ">{element.title}</span>
                </>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsMap;
