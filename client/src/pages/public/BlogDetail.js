import React, { useCallback, useEffect, useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { apiDislikeBlog, apiGetBlogDetail, apiLikeBlog } from "../../apis";
import moment from "moment";
import { Breadcrumb } from "../../components";
import DOMPurify from "dompurify";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import sweetAlert from "sweetalert2";
import path from "../../ultils/path";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const { bid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [countLike, setCountLike] = useState(0);
  const [countDislike, setCountDislike] = useState(0);
  const [hadLike, setHadLike] = useState(false);
  const [hadDislike, setHadDislike] = useState(false);
  const [update, setUpdate] = useState(false);

  const { currentData } = useSelector((state) => state.user);

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchBlogData = async () => {
    const response = await apiGetBlogDetail(bid);
    if (response.success) {
      setBlog(response.getBlog);
      setCountLike(response.countLike);
      setCountDislike(response.countDislike);

      if (currentData) {
        const userId = currentData._id;

        // Kiểm tra xem userId có trong danh sách likes hay không
        const hasLiked = response.getBlog.listOfLikes.some(
          (like) => like._id === userId
        );
        setHadLike(hasLiked);

        // Kiểm tra xem userId có trong danh sách dislikes hay không
        const hasDisliked = response.getBlog.listOfDislikes.some(
          (dislike) => dislike._id === userId
        );
        setHadDislike(hasDisliked);
      }
    }
  };

  const handleLikeBlog = async () => {
    if (!currentData) {
      return sweetAlert
        .fire({
          title: "Thông báo",
          text: "Hãy đăng nhập để tiếp tục",
          icon: "info",
          cancelButtonAriaLabel: "Hủy",
          showCancelButton: true,
          confirmButtonText: "Tới trang đăng nhập",
        })
        .then((rs) => {
          if (rs.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
    }
    const response = await apiLikeBlog(bid);
    if (response.success) {
      reRender();
    }
  };

  const handleDislikeBlog = async () => {
    if (!currentData) {
      return sweetAlert
        .fire({
          title: "Thông báo",
          text: "Hãy đăng nhập để tiếp tục",
          icon: "info",
          cancelButtonAriaLabel: "Hủy",
          showCancelButton: true,
          confirmButtonText: "Tới trang đăng nhập",
        })
        .then((rs) => {
          if (rs.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
    }
    const response = await apiDislikeBlog(bid);
    if (response.success) {
      reRender();
    }
  };

  useEffect(() => {
    if (bid || update) {
      fetchBlogData();
    }
  }, [bid, update]);

  return (
    <div className="w-[calc(100%-20px)] md:w-main ">
      <Breadcrumb title={blog?.title} />
      <div className="w-full bg-white">
        <div className="flex justify-center p-6">
          <div className="grid grid-rows-1 w-[800px]">
            <div className="w-fit">
              <img alt="" src={blog?.image} className="object-contain" />
            </div>
            <div className="text-normal md:text-3xl font-semibold mt-4">
              {blog?.title}
            </div>
            <div className="grid grid-cols-8 text-sm my-4 ">
              <div className="col-span-1">
                {moment(blog?.updatedAt)?.format("DD/MM/YYYY")}
              </div>
              <div className="col-span-7 flex gap-6">
                <span className=" flex">
                  <span>{countLike}</span>
                  <span
                    onClick={() => handleLikeBlog()}
                    className="cursor-pointer ml-4"
                  >
                    {hadLike ? (
                      <AiFillLike size={20} color="blue" />
                    ) : (
                      <AiOutlineLike size={20} />
                    )}
                  </span>
                </span>
                <span className=" flex">
                  <span>{countDislike}</span>
                  <span
                    onClick={() => handleDislikeBlog()}
                    className="cursor-pointer ml-4"
                  >
                    {hadDislike ? (
                      <AiFillDislike color="red" size={20} />
                    ) : (
                      <AiOutlineDislike size={20} />
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog?.description),
              }}
            ></div>
          </div>
        </div>
      </div>
      <Helmet>
        <title>{blog?.title}</title>
      </Helmet>
    </div>
  );
};

export default BlogDetail;
