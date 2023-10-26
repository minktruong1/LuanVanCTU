import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetBlogDetail } from "../../apis";
import moment from "moment";

const BlogDetail = () => {
  const [Blog, setBlog] = useState(null);
  const { bid, title } = useParams();

  const fetchBlogData = async () => {
    const response = await apiGetBlogDetail(bid);
    if (response.success) {
      setBlog(response.getBlog);
    }
  };

  useEffect(() => {
    if (bid) {
      fetchBlogData();
    }
  }, [bid]);

  return (
    <div className="w-[calc(100%-20px)] md:w-main bg-white rounded">
      <div className="flex justify-center p-6">
        <div className="grid grid-rows-1 w-[800px]">
          <div className="grid grid-cols-1">
            <div className="w-fit">
              <img alt="" src={Blog?.image} className="object-contain" />
            </div>
            <div className="text-normal md:text-3xl font-semibold mt-4">
              {Blog?.title}
            </div>
            <div className="text-sm my-4">
              {moment(Blog?.updatedAt)?.format("DD/MM/YYYY")}
            </div>
            <div>{Blog?.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
