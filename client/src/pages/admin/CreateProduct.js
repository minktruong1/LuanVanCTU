import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ReactInputForm,
  AdminSelector,
  Button,
  MarkdownEditor,
  Loading,
} from "../../components/index";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { formValidate, getBase64 } from "../../ultils/helpers";
import icons from "../../ultils/icons";
import clsx from "clsx";
import { apiCreateProduct } from "../../apis";
import { showModal } from "../../store/app/appSlice";

const { FaTimes } = icons;

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.appReducer);
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
    images: [],
  });

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handleReviewImages = async (files) => {
    const imagesReview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("Định dạng file không hỗ trợ");
        return;
      }
      const base64 = await getBase64(file);
      imagesReview.push({ name: file.name, path: base64 });
    }
    setReview((prev) => ({ ...prev, images: imagesReview }));
  };

  const handleRemoveImage = () => {
    reset({ images: "" });
    setReview({ images: [] });
  };

  const handleCreateProduct = async (data) => {
    const invalids = formValidate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        data.category = categories?.find(
          (element) => element._id === data.category
        )?.title;

        const groupData = { ...data, ...payload };

        const formData = new FormData();
        for (let i of Object.entries(groupData)) {
          formData.append(i[0], i[1]);
        }
        if (groupData.images) {
          for (let image of groupData.images) {
            formData.append("images", image);
          }
        }

        dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
        const response = await apiCreateProduct(formData);
        dispatch(showModal({ isShowModal: false, modalContent: null }));
        if (response.success) {
          toast.success(response.message);
          reset();
          setPayload({
            description: "",
          });
        } else {
          toast.error(response.message);
        }
      }
    }
  };

  useEffect(() => {
    handleReviewImages(watch("images"));
  }, [watch("images")]);

  return (
    <div className="w-full ">
      <div
        className="h-[75px] w-full flex justify-between 
      items-center text-2xl font-bold px-4 border-b   bg-webBackground "
      >
        <h1>Thêm sản phẩm</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <div className="flex flex-col gap-2 mt-8 mb-8 ">
            <label className="font-semibold" htmlFor="productImages">
              Upload ảnh của sản phẩm
            </label>
            <div
              className={clsx(
                " w-fit p-2 relative",
                review.images.length > 0 && "border border-red-600"
              )}
            >
              {review.images.length > 0 && (
                <div className="my-4 flex w-full gap-3 flex-wrap">
                  {review.images?.map((element, index) => (
                    <div className="w-fit ">
                      <img
                        key={index}
                        src={element.path}
                        alt="products"
                        className="w-[200px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
              {review.images.length > 0 && (
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
              multiple
              {...register("images", { required: "Chọn ít nhất 1 ảnh" })}
              className="w-fit"
            />
            {errors["images"] && (
              <small className="text-xs text-red-600">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          <ReactInputForm
            label="Tên sản phẩm"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Vui lòng nhập",
            }}
            fullWidth
            placeholder="Tên của sản phẩm mới"
          />
          <div className="w-full my-6 flex gap-4">
            <ReactInputForm
              label="Giá bán ra"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Vui lòng nhập",
              }}
              placeholder="Giá của sản phẩm mới"
              type="number"
              style="flex-1"
              fullWidth
            />
            <ReactInputForm
              label="Giá mua vào"
              register={register}
              errors={errors}
              id="buyInPrice"
              validate={{
                required: "Vui lòng nhập",
              }}
              placeholder="Giá nhập sản phẩm mới"
              type="number"
              style="flex-1"
              fullWidth
            />
            <ReactInputForm
              label="Số lượng"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Vui lòng nhập",
              }}
              placeholder="Số lượng của sản phẩm mới"
              type="number"
              style="flex-1"
              fullWidth
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <AdminSelector
              label="Category"
              options={categories?.map((element) => ({
                value: element._id,
                text: element.title,
              }))}
              register={register}
              id="category"
              validate={{ required: "Vui lòng nhập" }}
              errors={errors}
              fullWidth
              style="flex-1"
            />
            <AdminSelector
              label="Brand"
              options={categories
                ?.find((element) => element._id === watch("category"))
                ?.brand?.map((element) => ({ value: element, text: element }))}
              register={register}
              id="brand"
              errors={errors}
              fullWidth
              style="flex-1"
            />
          </div>
          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label="Mô tả sản phẩm"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="mt-8">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
