import React from "react";
import { useSelector } from "react-redux";
import { BlogItem, Breadcrumb } from "../../components";
import emptyData from "../../assets/no-data.png";
import { Helmet } from "react-helmet";

const Blogs = () => {
  window.scrollTo(0, 0);

  const { blogList } = useSelector((state) => state.blogReducer);

  return (
    <div className="w-[calc(100%-20px)] md:w-main  ">
      <Breadcrumb />
      <div className="w-full bg-white p-4 rounded">
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
      <Helmet>
        <title>Tin tức công nghệ</title>
      </Helmet>
    </div>
  );
};

export default Blogs;
