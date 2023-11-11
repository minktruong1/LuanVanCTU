import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteCategory, apiUpdateCategory } from "../../apis/category";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import { Button, Loading, ReactInputForm } from "../../components";
import { getBase64 } from "../../ultils/helpers";
import { showModal } from "../../store/app/appSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import sweetAlert from "sweetalert2";
import { apiGetCategories } from "../../apis";

const ManageCate = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    title: "",
    brand: "",
  });
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const [editCate, setEditCate] = useState(null);
  const [update, setUpdate] = useState(false);
  const [categories, setCategories] = useState(null);
  const [review, setReview] = useState({
    image: "",
  });

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchCategories = async () => {
    const response = await apiGetCategories();
    if (response.success) {
      setCategories(response.categories);
    }
  };

  const handleBack = () => {
    setEditCate(null);
    setReview({
      image: "",
    });
  };

  const handleSelectUpdate = async (data) => {
    setEditCate(data);
    setReview({
      image: data.image,
    });
  };

  const handleReviewImage = async (file) => {
    const base64Thumb = await getBase64(file);
    setReview((prev) => ({ ...prev, image: base64Thumb }));
  };

  const handleDelete = (cateid) => {
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn chắc chắn muốn nhóm này?",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        confirmButtonText: "Đồng ý",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await apiDeleteCategory(cateid);
          if (response.success) {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            toast.success(response.message);
          } else toast.error(response.message);
        }
      });
  };

  const handleUpdate = async (data) => {
    const groupData = { ...data };
    if (data.title) {
      data.title = categories?.find((el) => el.title === data.title)?.title;
    }
    groupData.image = data?.image?.length === 0 ? review.image : data.image[0];
    data.brand = data.brand[0].split(",").map((item) => item.trim());
    const formData = new FormData();
    for (let i of Object.entries(groupData)) {
      formData.append(i[0], i[1]);
    }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateCategory(formData, editCate?._id);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      toast.success(response.message);
      reRender();
      setEditCate(false);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (watch("image") instanceof FileList && watch("image").length > 0)
      handleReviewImage(watch("image")[0]);
  }, [watch("image")]);

  useEffect(() => {
    if (editCate) {
      reset({
        title: editCate.title,
        brand: editCate.brand,
      });
      setReview({
        image: editCate?.image || "",
      });
    }
  }, [editCate]);

  useEffect(() => {
    fetchCategories();
  }, [update]);

  return (
    <div className="w-full p-4 relative overflow-auto">
      <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b">
        <h1>Quản lý nhóm sản phẩm</h1>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <table className="table-auto w-[700px] md:w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th className="w-[400px]">Tên nhóm sản phẩm</th>
              <th>Các hãng liên quan</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {categories?.map((element, index) => (
              <>
                <tr
                  key={element?._id}
                  className={clsx("", index % 2 === 1 && "bg-[#fff]")}
                >
                  <td className="py-2 px-2">
                    {params.get("page") > 0 &&
                      (params.get("page") - 1) * 10 + index + 1}
                    {!params.get("page") && index + 1}
                  </td>
                  <td className="text-left flex items-center">
                    <img
                      src={element.image}
                      alt=""
                      className="w-[60px] h-[60px]"
                    />
                    {element.title}
                  </td>
                  <td className="text-left ">
                    {element?.brand?.map((element) => (
                      <span className="px-2 border border-black rounded mr-2">
                        {element}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span
                      onClick={() => handleSelectUpdate(element)}
                      className="underline cursor-pointer mr-2 text-canClick"
                    >
                      Sửa
                    </span>
                    <span
                      onClick={() => handleDelete(element._id)}
                      className="underline cursor-pointer text-canClick"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
                {element?._id === editCate?._id && (
                  <>
                    <tr>
                      <td></td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"title"}
                            validate={{
                              required: "Vui lòng nhập",
                            }}
                            defaultValue={editCate?.title}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"brand"}
                            validate={{
                              required: "Vui lòng nhập",
                            }}
                            defaultValue={editCate?.brand}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input type="file" id="image" {...register("image")} />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {review.image && (
                          <div className="my-4">
                            <img
                              src={review.image}
                              alt="imagee"
                              className="w-[200px] object-contain"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr className="border">
                      <td></td>
                      <td className="text-left">
                        <span
                          onClick={() => handleBack()}
                          className="mr-[16px] underline text-canClick cursor-pointer"
                        >
                          Trở về
                        </span>
                        {editCate && <Button type="submit">Cập nhật</Button>}
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default ManageCate;
