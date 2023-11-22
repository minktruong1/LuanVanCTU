import React, { useEffect, useState } from "react";
import { Button, Loading, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getBase64 } from "../../ultils/helpers";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import clsx from "clsx";
import { showModal } from "../../store/app/appSlice";
import { apiCreateCategory } from "../../apis/category";

const CreateCategory = () => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();

  const [review, setReview] = useState({
    image: null,
  });

  const handlePreviewThumb = async (file) => {
    if (file?.type !== "image/png" && file?.type !== "image/jpeg" && file) {
      toast.warning("File không được hỗ trợ");
      return;
    } else {
      const base64 = await getBase64(file);
      setReview((prev) => ({ ...prev, image: base64 }));
    }
  };

  const handleCreateCate = async (data) => {
    const groupData = { ...data };

    const formData = new FormData();
    for (let i of Object.entries(groupData)) {
      formData.append(i[0], i[1]);
    }
    if (groupData.image) {
      formData.append("image", groupData.image[0]);
    }

    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const response = await apiCreateCategory(formData);
    dispatch(showModal({ isShowModal: false, modalContent: null }));
    if (response.success) {
      toast.success(response.message);
      reset();
      setReview((review.image = ""));
    } else {
      toast.error(response.message);
    }
  };

  const handleRemoveImage = () => {
    reset({ image: "" });
    setReview({ images: "" });
  };

  useEffect(() => {
    if (watch("image") instanceof FileList && watch("image").length > 0)
      handlePreviewThumb(watch("image")[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("image")]);

  return (
    <div className="w-full">
      <div className="p-4 mt-[60px]">
        <form onSubmit={handleSubmit(handleCreateCate)}>
          <div className="flex flex-col gap-2 mt-8 mb-8 ">
            <label className="font-semibold" htmlFor="productImages">
              Upload ảnh của bài viết
            </label>
            <div
              className={clsx(
                "p-2 relative border w-[200px]",
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
              id="productImages"
              {...register("image", { required: "Chọn ít nhất 1 ảnh" })}
              className="w-fit"
            />
            {errors["image"] && (
              <small className="text-xs text-red-600">
                {errors["image"]?.message}
              </small>
            )}
          </div>
          <div className="grid grid-rows-1 gap-[50px]">
            <div className="w-full grid grid-cols-2 gap-4">
              <ReactInputForm
                label="Tên nhóm"
                register={register}
                errors={errors}
                id="title"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Tên của nhóm sản phẩm"
              />
              <ReactInputForm
                label="Tên hãng"
                register={register}
                errors={errors}
                id="brand"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Nhập theo dạng: hang1,hang2,..."
              />
            </div>
          </div>

          <div className="mt-[50px]">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
