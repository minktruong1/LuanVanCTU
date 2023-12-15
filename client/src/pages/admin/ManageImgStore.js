import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import { Button, Loading, ReactInputForm } from "../../components";
import { getBase64 } from "../../ultils/helpers";
import { showModal } from "../../store/app/appSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import sweetAlert from "sweetalert2";
import {
  apiDeleteImgStore,
  apiGetAllImgStore,
  apiUpdateImgStore,
} from "../../apis";

const ManageImgStore = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    title: "",
  });
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const [editCate, setEditCate] = useState(null);
  const [update, setUpdate] = useState(false);
  const [imgBlock, setImgBlock] = useState(null);
  const [review, setReview] = useState({
    images: [],
  });

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchCategories = async () => {
    const response = await apiGetAllImgStore();

    if (response.success) {
      setImgBlock(response.images);
    }
  };

  const handleBack = () => {
    setEditCate(null);
    setReview({
      images: [],
    });
  };

  const handleReviewImages = async (files) => {
    const imagesReview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("Định dạng file không hỗ trợ");
        return;
      }
      const base64 = await getBase64(file);
      imagesReview.push(base64);
    }
    setReview((prev) => ({ ...prev, images: imagesReview }));
  };

  const handleSelectUpdate = async (data) => {
    setEditCate(data);
    setReview({
      images: [],
    });
  };

  const handleDelete = (imgid) => {
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
          dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
          const response = await apiDeleteImgStore(imgid);
          dispatch(showModal({ isShowModal: false, modalContent: null }));

          if (response.success) {
            toast.success(response.message);
            reRender();
          } else {
            toast.error(response.message);
          }
        }
      });
  };

  const handleUpdate = async (data) => {
    const groupData = { ...data };
    const formData = new FormData();

    for (let i of Object.entries(groupData)) {
      if (i[0] === "images") {
        if (i[1] instanceof FileList && i[1].length > 0) {
          const imagesToUpload = Array.from(i[1]);
          for (let image of imagesToUpload) {
            formData.append("images", image);
          }
        }
      } else {
        formData.append(i[0], i[1]);
      }
    }

    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const response = await apiUpdateImgStore(formData, editCate?._id);
    dispatch(showModal({ isShowModal: false, modalContent: null }));
    if (response.success) {
      toast.success(response.message);
      reRender();
      setEditCate(null);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (editCate) {
      reset({
        title: editCate.title,
      });
    }
  }, [editCate]);

  useEffect(() => {
    fetchCategories();
  }, [update]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handleReviewImages(watch("images"));
    }
  }, [watch("images")]);

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
              <th className="w-[130px]">Tên nhóm ảnh</th>
              <th className="w-[800px]">Các ảnh trong nhóm</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {imgBlock?.map((element, index) => (
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
                  <td className="text-left">{element.title}</td>
                  <td className="flex flex-wrap gap-2">
                    {element?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="products"
                        className="w-[180px] object-contain border border-black"
                      />
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
                      <td className="py-2 px-2 w-[180px]">
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
                        {review.images.length > 0 && (
                          <div className="my-4 flex w-full gap-3 flex-wrap">
                            {review.images?.map((element, index) => (
                              <div className="w-fit">
                                <img
                                  key={index}
                                  src={element}
                                  alt="products"
                                  className="w-[180px] object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="w-[180px]">
                      <td></td>
                      <td>
                        <input
                          type="file"
                          id="imgInput"
                          multiple
                          {...register("images")}
                          className="w-fit"
                        />
                      </td>

                      <td></td>
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

export default ManageImgStore;
