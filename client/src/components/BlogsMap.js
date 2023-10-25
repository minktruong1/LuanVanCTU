import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import path from "../ultils/path";

const BlogsMap = () => {
  const { blogList } = useSelector((state) => state.blogReducer);

  return (
    <>
      <div className="bg-white w-[calc(100%-20px)] md:w-full p-4 ">
        <div className="text-xl hidden md:flex justify-between items-center">
          <span>Tin tức công nghệ</span>
          <Link
            to={`/${path.BLOGS}`}
            className="text-sm text-canClick cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-2 mt-2">
          {blogList?.slice(0, 4).map((element) => (
            <Link
              to={`/blogs/${element?._id}/${element?.title}`}
              key={element._id}
              className=""
            >
              <div>
                <img alt="" src={element.image} className="" />
              </div>
              <span className="line-clamp-2 text-sm md:text-normal">
                {element.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogsMap;
