import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Loading,
  MarkdownEditor,
  ReactInputForm,
} from "../../components";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { MdArrowBackIosNew } from "react-icons/md";
import { apiAdminDeleteBlog, apiAdminUpdateBlog } from "../../apis";
import { formValidate, getBase64 } from "../../ultils/helpers";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import sweetAlert from "sweetalert2";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const UpdateBlog = ({ editBlogTab, setEditBlogTab }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const [review, setReview] = useState({
    image: "",
  });

  const [payload, setPayload] = useState({
    description: "",
  });

  const dispatch = useDispatch();

  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    reset({
      title: editBlogTab?.title || "",
      category: editBlogTab?.category?.toLowerCase() || "",
    });
    setPayload({
      description:
        typeof editBlogTab?.description === "object"
          ? editBlogTab?.description.join(", ")
          : editBlogTab?.description,
    });
    setReview({
      image: editBlogTab?.image || "",
    });
  }, [editBlogTab]);

  const handleReviewImages = async (file) => {
    const blogImg = await getBase64(file);
    setReview((prev) => ({ ...prev, image: blogImg }));
  };

  const handleUpdateBlog = async (data) => {
    const invalids = formValidate(payload, setInvalidFields);
    if (invalids === 0) {
      const groupData = { ...data, ...payload };
      groupData.image =
        data?.image?.length === 0 ? review.image : data.image[0];
      const formData = new FormData();

      for (let i of Object.entries(groupData)) {
        formData.append(i[0], i[1]);
      }
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
      const response = await apiAdminUpdateBlog(formData, editBlogTab._id);
      dispatch(showModal({ isShowModal: false, modalContent: null }));

      if (response.success) {
        toast.success(response.message);
        setEditBlogTab(null);
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleDeleteBlog = (bid) => {
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn muốn xóa sản phẩm này?",
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await apiAdminDeleteBlog(bid);
          if (response.success) {
            toast.success(response.message);
            setEditBlogTab(null);
          } else {
            toast.error(response.message);
          }
        }
      });
  };

  const handleRemoveImage = () => {
    reset({ image: "" });
    setReview({ images: "" });
  };

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  useEffect(() => {
    if (watch("image") instanceof FileList && watch("image").length > 0)
      handleReviewImages(watch("image")[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("image")]);

  return (
    <div className="w-full p-4">
      <div className="mt-[60px] text-lg">
        <span
          onClick={() => setEditBlogTab(null)}
          className="underline text-canClick flex items-center cursor-pointer"
        >
          <MdArrowBackIosNew />
          Trở về
        </span>
      </div>
      <div className="md:p-4">
        <form onSubmit={handleSubmit(handleUpdateBlog)}>
          <div className="flex flex-col gap-2 mt-8 mb-8 ">
            <label className="font-semibold" htmlFor="productImages">
              Upload ảnh của bài viết
            </label>
            <div
              className={clsx(
                "w-fit p-2 relative border ",
                review.image && "border-main"
              )}
            >
              {review.image && (
                <div className="my-4">
                  <img
                    src={review.image}
                    alt="avatar"
                    className="w-[400px] object-contain"
                  />
                </div>
              )}
              {review.image && (
                <div
                  onClick={() => handleRemoveImage()}
                  className="absolute top-[-8px] right-[-8px] cursor-pointer rounded-full p-1 bg-red-600"
                >
                  <span className="text-white ">
                    <FaTimes />
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="image"
              {...register("image")}
              className="w-fit"
            />
            {errors["image"] && (
              <small className="text-xs text-red-600">
                {errors["image"]?.message}
              </small>
            )}
          </div>

          <div className="w-full my-6 flex gap-4">
            <ReactInputForm
              label="Tên bài viết"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Vui lòng nhập",
              }}
              fullWidth
              placeholder="Tên của bài viết mới"
            />
            <ReactInputForm
              label="Loại bài viết"
              register={register}
              errors={errors}
              id="category"
              validate={{
                required: "Vui lòng nhập",
              }}
              fullWidth
              placeholder="Loại của bài viết mới"
            />
          </div>
          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
          />
          <div className="mt-8 flex justify-between">
            <Button type="submit">Cập nhật</Button>
            <span
              onClick={() => handleDeleteBlog(editBlogTab._id)}
              className="px-4 py-2 bg-green-500 cursor-pointer text-white"
            >
              Xóa
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
