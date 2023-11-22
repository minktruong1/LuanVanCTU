import moment from "moment";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const BlogItem = ({ data }) => {
  return (
    <div className="grid grid-cols-10 gap-5 py-4 border-b">
      <Link
        to={`/blogs/${data?._id}/${data?.slug}`}
        className="col-span-3 md:col-span-2 cursor-pointer"
      >
        <img alt="" src={data.image} className="rounded" />
      </Link>
      <div className="col-span-7 md:col-span-8">
        <div className="grid grid-rows-1">
          <Link
            to={`/blogs/${data?._id}/${data?.slug}`}
            className="font-semibold hover:text-main"
          >
            {data.title}
          </Link>
          <div className="flex items-center">
            <AiOutlineClockCircle />
            <span className="ml-2">
              {moment(data.date)?.format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
