import React, { memo, useCallback, useEffect, useState } from "react";
import {
  AdminSelector,
  Button,
  Loading,
  MarkdownEditor,
  ReactInputForm,
} from "../../components";
import { useForm } from "react-hook-form";
import { formValidate, getBase64 } from "../../ultils/helpers";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import { apiUpdateProduct, apiDeleteProduct } from "../../apis";
import icons from "../../ultils/icons";

const { MdArrowBackIosNew } = icons;

const UpdateProduct = ({ editProductTab, render, setEditProductTab }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.appReducer);

  const [payload, setPayload] = useState({
    description: "",
  });
  const [review, setReview] = useState({
    images: [],
  });

  useEffect(() => {
    reset({
      title: editProductTab?.title || "",
      price: editProductTab?.price || "",
      buyInPrice: editProductTab?.buyInPrice || "",
      quantity: editProductTab?.quantity || "",
      category: editProductTab?.category?.toLowerCase() || "",
      brand: editProductTab?.brand?.toLowerCase() || "",
    });
    setPayload({
      description:
        typeof editProductTab?.description === "object"
          ? editProductTab?.description.join(", ")
          : editProductTab?.description,
    });
    setReview({
      images: editProductTab?.images || [],
    });
  }, [editProductTab]);

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

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handleUpdateProduct = async (data) => {
    const invalids = formValidate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        const groupData = { ...data, ...payload };

        groupData.images =
          data?.images?.length === 0 ? review.images : data.images;

        data.category = categories?.find(
          (element) => element.title === data.category
        )?.title;

        const formData = new FormData();

        for (let i of Object.entries(groupData)) {
          formData.append(i[0], i[1]);
        }

        for (let image of groupData.images) {
          formData.append("images", image);
        }

        dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
        const response = await apiUpdateProduct(formData, editProductTab?._id);
        dispatch(showModal({ isShowModal: false, modalContent: null }));
        if (response.success) {
          toast.success(response.message);
          render();
          setEditProductTab(null);
        } else {
          toast.error(response.message);
        }
      }
    }
  };

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handleReviewImages(watch("images"));
    }
  }, [watch("images")]);

  return (
    <div className="w-full flex flex-col ">
      <div className="p-4">
        <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b">
          <h1>Cập nhật sản phẩm</h1>
        </div>
        <div className="mb-4 w-fit">
          <span
            onClick={() => setEditProductTab(null)}
            className="underline text-canClick flex items-center cursor-pointer"
          >
            <MdArrowBackIosNew />
            Trở về
          </span>
        </div>
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <div className="flex flex-col gap-2  ">
            <label className="font-semibold" htmlFor="productImages">
              Upload ảnh của sản phẩm
            </label>
            <div className={clsx(" w-fit p-2 ")}>
              {review.images.length > 0 && (
                <div className="my-4 flex w-full gap-3 flex-wrap">
                  {review.images?.map((element, index) => (
                    <div className="w-fit ">
                      <img
                        key={index}
                        src={element}
                        alt="products"
                        className="w-[200px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="file"
              id="productImages"
              multiple
              {...register("images")}
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
              label="Giá mua vào sản phẩm"
              register={register}
              errors={errors}
              id="buyInPrice"
              validate={{
                required: "Vui lòng nhập",
              }}
              placeholder="Giá mua vào phẩm mới"
              type="number"
              style="flex-1"
              fullWidth
            />
            <ReactInputForm
              label="Giá sản phẩm"
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
                value: element.title.toLowerCase(),
                text: element.title.replace(
                  /^./,
                  element.title[0].toUpperCase()
                ),
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
                ?.find((element) => element.title === watch("category"))
                ?.brand?.map((element) => ({
                  value: element.toLowerCase(),
                  text: element,
                }))}
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
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
          />
          <div className="mt-8">
            <Button type="submit">Cập nhật</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
