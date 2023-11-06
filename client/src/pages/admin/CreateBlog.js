import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ReactInputForm,
  Button,
  MarkdownEditor,
  Loading,
} from "../../components/index";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { formValidate, getBase64 } from "../../ultils/helpers";
import icons from "../../ultils/icons";
import clsx from "clsx";
import { apiCreateBlog } from "../../apis";
import { showModal } from "../../store/app/appSlice";

const { FaTimes } = icons;

const CreateBlog = () => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({
    description: "",
  });

  const [review, setReview] = useState({
    image: "",
  });

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handleReviewImages = async (file) => {
    const blogImg = await getBase64(file);
    setReview((prev) => ({ ...prev, image: blogImg }));
  };

  const handleRemoveImage = () => {
    reset({ image: "" });
    setReview({ images: "" });
  };

  const handleCreateBlog = async (data) => {
    const invalids = formValidate(payload, setInvalidFields);
    if (invalids === 0) {
      const groupData = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(groupData)) {
        formData.append(i[0], i[1]);
      }
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
      const response = await apiCreateBlog(formData);
      dispatch(showModal({ isShowModal: false, modalContent: null }));

      if (response.success) {
        toast.success(response.message);
        reset();
        setReview({ images: [] });
        setPayload({
          description: "",
        });
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    if (watch("image") instanceof FileList && watch("image").length > 0)
      handleReviewImages(watch("image")[0]);
  }, [watch("image")]);

  return (
    <div className="w-full">
      <div className="p-4 mt-[60px]">
        <form onSubmit={handleSubmit(handleCreateBlog)}>
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
          />
          <div className="mt-8">
            <Button type="submit">Tạo</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
