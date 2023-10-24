import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BlogItem } from "../../components";
import emptyData from "../../assets/no-data.png";

const Blogs = () => {
  const { blogList } = useSelector((state) => state.blogReducer);

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-[calc(100%-20px)] md:w-main bg-white rounded p-4">
      {blogList?.length === 0 ? (
        <div className="flex justify-center min-h-[600px]">
          <img alt="empty" src={emptyData} className="object-contain" />
        </div>
      ) : (
        <>
          {blogList?.map((element) => (
            <BlogItem data={element} />
          ))}
        </>
      )}
    </div>
  );
};

export default Blogs;
