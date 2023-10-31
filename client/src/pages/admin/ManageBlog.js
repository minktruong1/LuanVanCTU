import React, { useEffect, useState } from "react";
import { apiAdminGetBlogs } from "../../apis";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { Pagination, ReactInputForm } from "../../components";
import clsx from "clsx";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";
import UpdateBlog from "./UpdateBlog";

const ManageBlog = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [blogs, setBlogs] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const [editBlogTab, setEditBlogTab] = useState(null);

  const queryDebounce = useDebounce(watch("query"), 800);

  const fetchBlogs = async (params) => {
    const response = await apiAdminGetBlogs(params);
    if (response.success) {
      setBlogs(response.blogs);
      setBlogCount(response.counts);
    }
  };

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ query: queryDebounce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchBlogs({ ...searchParams });
  }, [params]);

  return (
    <div className="w-full p-4 relative">
      {editBlogTab && (
        <div className="absolute inset-0 min-h-screen bg-webBackground z-20">
          <UpdateBlog
            editBlogTab={editBlogTab}
            setEditBlogTab={setEditBlogTab}
          />
        </div>
      )}
      <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b bg-webBackground">
        <h1>Quản lý bài viết</h1>
      </div>

      <form className="w-[40%] py-4">
        <ReactInputForm
          id="query"
          register={register}
          errors={errors}
          fullWidth
          placeholder="Tìm kiếm đơn hàng"
        />
      </form>
      <div className="w-full ">
        <table className="table-auto w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th className=" w-[400px]">Tên bài viết</th>
              <th>Loại</th>
              <th>Lượt xem</th>
              <th>Ngày đăng</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {blogs?.map((element, index) => (
              <tr
                key={element._id}
                className={clsx("", index % 2 === 1 && "bg-[#fff]")}
              >
                <td>
                  {params.get("page") > 0 &&
                    (params.get("page") - 1) * 10 + index + 1}
                  {!params.get("page") && index + 1}
                </td>
                <td className="text-left">{element.title}</td>
                <td>{element.category}</td>
                <td>{element.viewNumber}</td>
                <td>{moment(element?.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <span
                    onClick={() => setEditBlogTab(element)}
                    className="text-canClick underline cursor-pointer"
                  >
                    Xử lý
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={blogCount} />
        </div>
      </div>
    </div>
  );
};

export default ManageBlog;
