import React, { useCallback, useEffect, useState } from "react";
import { Loading, Pagination, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { apiDeleteProduct, apiGetProducts } from "../../apis";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
import useDebounce from "../../hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import sweetAlert from "sweetalert2";
import { toast } from "react-toastify";
import { formatVND } from "../../ultils/helpers";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";

const ManageProducts = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [editProductTab, setEditProductTab] = useState(null);
  const [update, setUpdate] = useState(false);

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const fetchProducts = async (params) => {
    const response = await apiGetProducts(params);
    if (response.success) {
      setProducts(response.products);
      setProductCount(response.counts);
    }
  };

  const queryDebounce = useDebounce(watch("query"), 800);

  const handleDeleteProduct = (pid) => {
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn muốn xóa sản phẩm này?",
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
          const response = await apiDeleteProduct(pid);
          dispatch(showModal({ isShowModal: false, modalContent: null }));

          if (response.success) {
            render();
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        }
      });
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
  }, [queryDebounce, update]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);

    fetchProducts({ ...searchParams });
  }, [params, editProductTab]);

  return (
    <div className="w-full flex flex-col relative overflow-auto min-h-screen">
      {editProductTab && (
        <div className="absolute inset-0 min-h-screen bg-webBackground z-20 w-[1300px] md:w-full">
          <UpdateProduct
            editProductTab={editProductTab}
            setEditProductTab={setEditProductTab}
            render={render}
          />
        </div>
      )}
      <div className="h-[75px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b bg-webBackground">
        <h1>Quản lý sản phẩm</h1>
      </div>
      <div className="w-full p-4 min-h-screen">
        <div className="">
          <form className="w-[40%] py-4">
            <ReactInputForm
              id="query"
              register={register}
              errors={errors}
              fullWidth
              placeholder="Tìm kiếm sản phẩm"
            />
          </form>
        </div>

        <table className="table-auto w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th className="w-[400px]">Tên sản phẩm</th>
              <th>Hãng</th>
              <th>Loại</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Đã bán</th>
              <th>Đánh giá</th>
              <th className="">Cập nhật</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border">
            {products?.map((element, index) => (
              <tr
                key={element._id}
                className={clsx("", index % 2 === 1 && "bg-[#fff]")}
              >
                <td>
                  {params.get("page") > 0 &&
                    (params.get("page") - 1) * 10 + index + 1}
                  {!params.get("page") && index + 1}
                </td>
                <td className="flex items-center w-[400px]">
                  <img
                    src={element?.images[0]}
                    alt="avt"
                    className="w-[70px] h-[70px] object-cover mr-[12px]"
                  />
                  {element.title}
                </td>
                <td>{element.brand}</td>
                <td>{element.category}</td>
                <td>{`${formatVND(element.buyInPrice)}đ`}</td>
                <td>{`${formatVND(element.price)}đ`}</td>
                <td>{element.quantity}</td>
                <td>{element.sold}</td>
                <td>{element.reviewPoint}</td>
                <td>{moment(element.createdAt).format("DD/MM/YYYY")}</td>
                <td>
                  <span
                    onClick={() => setEditProductTab(element)}
                    className="underline cursor-pointer mr-2 text-canClick"
                  >
                    Sửa
                  </span>
                  <span
                    onClick={() => handleDeleteProduct(element._id)}
                    className="underline cursor-pointer text-canClick"
                  >
                    Xóa
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={productCount} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
