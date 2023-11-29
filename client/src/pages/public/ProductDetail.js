import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  createSearchParams,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  apiGetProductDetail,
  apiUpdateCart,
  apiReview,
  apiCheckedProduct,
} from "../../apis";
import {
  Breadcrumb,
  Button,
  Comment,
  QuantitySelector,
  RatingBar,
  RatingModal,
} from "../../components";
import Slider from "react-slick";
import { formatVND, pointToStar } from "../../ultils/helpers";
import icons from "../../ultils/icons";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import path from "../../ultils/path";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { apiGetCurrentAccount } from "../../store/users/asyncActions";
import { Helmet } from "react-helmet";
import NotFound from "./NotFound";

const { GiCheckMark } = icons;

const reactSlickSetting = {
  dot: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pid, category, slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [chooseImage, setChooseImage] = useState(null);
  const [updateRatingBar] = useState(false);
  const [notFound, setNotFound] = useState(null);
  const [randomBlogs, setRandomBlogs] = useState([]);

  const { currentData } = useSelector((state) => state.user);
  const { blogList } = useSelector((state) => state.blogReducer);

  const getRandom4Blogs = (array, number) => {
    if (!array || array.length === 0) {
      return [];
    }

    const clonedArray = array.slice(); // Tạo một bản sao của mảng

    const shuffled = clonedArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
  };

  const fetchProductData = async () => {
    const response = await apiGetProductDetail(pid);
    if (response.success) {
      setProduct(response.getProduct);
      setChooseImage(response.getProduct?.images[0]);
    } else {
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [pid, updateRatingBar]);

  const handleQuantity = useCallback(
    (number, onStock) => {
      number = Number(number);
      if (!number || number < 1 || number > onStock) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );

  const handleButtonFunction = useCallback(
    (math, onStock) => {
      if (math === "decrease" && quantity === 1) {
        return;
      }
      if (math === "decrease") {
        setQuantity((previousNum) => +previousNum - 1);
      }
      if (math === "increase" && quantity >= onStock) {
        return;
      }
      if (math === "increase") {
        setQuantity((previousNum) => +previousNum + 1);
      }
    },
    [quantity]
  );

  const handleChooseImage = (e, element) => {
    e.stopPropagation();

    // Loại bỏ border đỏ của ảnh trước đó nếu có
    const previousSelectedImage = document.querySelector(
      ".product-detail-slick .border-vanilla-red"
    );
    if (previousSelectedImage) {
      previousSelectedImage.classList.remove("border-vanilla-red");
    }

    // Đặt border đỏ cho ảnh được chọn
    e.target.classList.add("border-vanilla-red");

    setChooseImage(element);
  };

  const handleAddToCart = async () => {
    if (!currentData) {
      return sweetAlert
        .fire({
          title: "Thông báo",
          text: "Vui lòng đăng nhập",
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
    const response = await apiUpdateCart({
      pid: product?._id,
      title: product?.title,
      category: product?.category,
      quantity,
      price: product?.price,
      images: product?.images,
      buyInPrice: product?.buyInPrice,
    });
    if (response.success) {
      toast.success(response.message);
      dispatch(apiGetCurrentAccount());
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (product !== null) {
      if (
        product?._id !== pid ||
        product?.category?.toLowerCase() !== category ||
        product?.slug !== slug
      ) {
        setNotFound(true);
      }
    }

    if (currentData) {
      apiCheckedProduct({ _id: currentData._id, pid: pid });
    }
  }, [currentData, product]);

  useEffect(() => {
    const randomBlogsResult = getRandom4Blogs(blogList, 4);
    setRandomBlogs(randomBlogsResult);
  }, [blogList]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="w-[calc(100%-20px)] "
        style={{
          maxWidth: "1200px",
        }}
      >
        {notFound ? (
          <NotFound />
        ) : (
          <>
            <div className="">
              <Breadcrumb title={product?.title} category={category} />
            </div>
            <div className="grid grid-rows-1 gap-2">
              <div className="bg-white grid grid-cols-1 md:grid-cols-12 rounded p-2 md:p-6 ">
                <div className="col-span-5">
                  <img
                    src={chooseImage}
                    alt="productImg"
                    className="h-[372px] w-[372px] object-cover "
                  />
                  <div className="w-[372px] relative z-0 mt-4">
                    <Slider
                      {...reactSlickSetting}
                      className="product-detail-slick flex gap-2 justify-between "
                    >
                      {product?.images?.map((element, index) => (
                        <div key={index} className=" flex-1 border-none">
                          <img
                            onClick={(e) => handleChooseImage(e, element)}
                            src={element}
                            alt=""
                            className="h-[108px] w-[108px] object-cover rounded-md cursor-pointer "
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                <div className="col-span-7">
                  <h1 className="font-bold text-lg md:text-2xl">
                    {product?.title}
                  </h1>
                  <div className="flex items-center mt-[4px] mb-[14px] divide-x divide-black gap-3">
                    <div className="flex items-center text-[#ff8a00]">
                      <span className="flex mr-[4px]">
                        {product?.reviewPoint.toFixed(1)}
                      </span>
                      <span className="flex ">
                        {pointToStar(product?.reviewPoint)?.map(
                          (element, index) => (
                            <span key={index}>{element}</span>
                          )
                        )}
                      </span>
                    </div>
                    <div className="pl-2 text-[#767676]">
                      <span className="mr-[4px]">
                        {product?.reviews.length}
                      </span>
                      <span>Đánh giá</span>
                    </div>
                    <div className="pl-2 text-[#767676]">
                      <span className="mr-[4px]">{product?.sold}</span>
                      <span>Đã bán</span>
                    </div>
                  </div>
                  <div className="w-full p-[12px] bg-webBackground text-lg md:text-xl  text-[#e30019] font-semibold mb-[12px]">
                    <span>{`${formatVND(product?.price)} VNĐ`}</span>
                  </div>
                  <div className="mb-[30px] mt-[16px]">
                    <ul className="leading-5">
                      <p>
                        <GiCheckMark />
                        Bảo hành chính hãng 24 tháng.
                      </p>
                      <p>
                        <GiCheckMark /> Hỗ trợ đổi mới trong 7 ngày.
                      </p>
                      <p>
                        <GiCheckMark />
                        Miễn phí giao hàng với hóa đơn trên 500.000vnđ.
                      </p>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <QuantitySelector
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        onChangeQuantity={handleButtonFunction}
                        onStock={product?.quantity}
                      />
                      <span className="ml-[8px] text-[#767676]">
                        {product?.quantity} sản phẩm có sẵn
                      </span>
                    </div>
                    <Button
                      style="w-full md:w-fit"
                      handleOnClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="col-span-7 border rounded bg-white">
                  <div className="p-2 md:p-6">
                    <h2 className="text-base md:text-xl font-semibold">
                      Mô tả sản phẩm
                    </h2>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product?.description),
                      }}
                    ></div>
                  </div>
                </div>
                <div className="border w-full rounded bg-white col-span-5 p-2 md:p-6">
                  <h2 className="  text-base md:text-xl font-semibold">
                    Tin tức
                  </h2>

                  <div className="grid grid-rows-1 gap-4">
                    {randomBlogs?.map((element, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2">
                        <Link
                          to={`/blogs/${element?._id}/${element?.slug}`}
                          className="col-span-4"
                        >
                          <img
                            alt="blog"
                            className="rounded md:h-[80px]"
                            src={element.image}
                          />
                        </Link>
                        <div className="col-span-8 truncate">
                          <Link
                            to={`/blogs/${element?._id}/${element?.slug}`}
                            className=" hover:text-main "
                          >
                            {element.title}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded">
                <div className="p-2 md:p-6">
                  <h1 className="text-lg md:text-[24px] font-semibold">
                    Đánh giá & Nhận xét {product?.title}
                  </h1>
                  <div className="grid grid-rows-1 md:grid-cols-3 gap-4 md:gap-8 mt-[12px]">
                    <div className="flex justify-center md:justify-end items-center ">
                      <div>
                        <span className="flex justify-center font-semibold text-[32px] text-[#E30019]">
                          {`${product?.reviewPoint}`}/5
                        </span>
                        <span className="flex justify-center mt-[12px] mb-[4px]">
                          {pointToStar(product?.reviewPoint)}
                        </span>
                        <span>
                          <span className="font-semibold mr-[4px]">{`${product?.reviews.length}`}</span>
                          đánh giá và nhận xét
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      {Array.from(Array(5).keys())
                        .reverse()
                        .map((element, index) => (
                          <RatingBar
                            key={index}
                            number={element + 1}
                            numberOfRatingCount={
                              product?.reviews?.filter(
                                (i) => i.star === element + 1
                              )?.length
                            }
                            totalOfRating={product?.reviews?.length}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="border-t">
                    <div className="flex flex-col gap-3">
                      {product?.reviews
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt) - new Date(a.updatedAt)
                        )
                        .map((element, index) => (
                          <Comment
                            key={index}
                            star={element.star}
                            updatedAt={element.updatedAt}
                            comment={element.comment}
                            name={`${element.owner?.lastName} ${element.owner?.firstName}`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Helmet>
        <title>{product?.title}</title>
      </Helmet>
    </>
  );
};

export default ProductDetail;
