import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGetProductDetail } from "../../apis";
import {
  Breadcrumb,
  Button,
  Comment,
  QuantitySelector,
  RatingBar,
  RatingCalculate,
  RatingModal,
} from "../../components";
import Slider from "react-slick";
import { formatVND, pointToStar } from "../../ultils/helpers";
import { apiReview } from "../../apis";
import icons from "../../ultils/icons";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import path from "../../ultils/path";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [chooseImage, setChooseImage] = useState(null);
  const [updateRatingBar, setUpdateRatingBar] = useState(false);

  const { isLogin } = useSelector((state) => state.user);

  const handleCollectReview = async ({ comment, point }) => {
    if (!comment && !point && pid) {
      alert("Hãy nhập nội dung đánh giá");
      return;
    }
    apiReview({ star: point, comment: comment, pid, updatedAt: Date.now() });
    dispatch(showModal({ isShowModal: false, modalContent: null }));
    setTimeout(() => {
      fetchProductData();
    }, 1000);
  };

  const handlePostReview = () => {
    if (!isLogin) {
      sweetAlert
        .fire({
          text: "Đăng nhập trước khi review",
          cancelButtonText: "Hủy",
          confirmButtonText: "Đến trang đăng nhập",
          showCancelButton: true,
          title: "Cảnh báo",
        })
        .then((rs) => {
          if (rs.isConfirmed) {
            navigate(`/${path.LOGIN}`);
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 100);
          }
        });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalContent: (
            <RatingModal
              productName={product?.title}
              productImage={product?.images[0]}
              handleCollectReview={handleCollectReview}
            />
          ),
          //getRatingProductImage: `${}`,
        })
      );
    }
  };

  // const rerender = useCallback(() => {
  //   setUpdateRatingBar(!updateRatingBar);
  // }, [updateRatingBar]);

  const fetchProductData = async () => {
    const response = await apiGetProductDetail(pid);
    if (response.success) {
      setProduct(response.getProduct);
      setChooseImage(response.getProduct?.images[0]);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [updateRatingBar]);

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

  return (
    <>
      <div className="w-main ">
        <div className="pt-[18px] pb-[18px]">
          <Breadcrumb title={title} category={category} />
        </div>
        <div className="bg-white w-main flex rounded mb-[14px]">
          <div className="w-[40%] flex flex-col gap-4 p-[24px]">
            <img
              src={chooseImage}
              alt="productImg"
              className="h-[372px] w-[372px] object-cover "
            />
            <div className="w-[372px]">
              <Slider
                {...reactSlickSetting}
                className="product-detail-slick flex gap-2 justify-between"
              >
                {product?.images?.map((element) => (
                  <div key={element} className=" flex-1 border-none">
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
          <div className="w-[60%] p-[24px]">
            <h1 className="font-bold text-[26px]">{product?.title}</h1>
            <div className="flex items-center mt-[4px] mb-[14px] divide-x divide-black gap-3">
              <div className="flex items-center text-[#ff8a00]">
                <span className="flex mr-[4px]">
                  {product?.reviewPoint.toFixed(1)}
                </span>
                <span className="flex ">
                  {pointToStar(product?.reviewPoint)?.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </span>
              </div>
              <div className=" pl-2">
                <span className="mr-[4px]">{product?.reviews.length}</span>
                <span className="text-[#767676]">Đánh giá</span>
              </div>
              <div className="pl-2 ">
                <span className="mr-[4px]">{product?.sold}</span>
                <span className="text-[#767676]">Đã bán</span>
              </div>
            </div>
            <div className="w-full p-[12px] bg-webBackground text-[28px] text-[#e30019] font-semibold mb-[12px]">
              <span className="">{`${formatVND(product?.price)} VNĐ`}</span>
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
                  {" "}
                  <GiCheckMark />
                  Miễn phí giao hàng toàn quốc.
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
              <Button>Thêm vào giỏ hàng</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full mb-[14px] gap-3">
          <div className="flex flex-col w-[60%] border rounded bg-white">
            <div className="p-[24px] pt-[16px] pb-[16px] ">
              <h2 className="text-[22px] font-semibold">Mô tả sản phẩm</h2>
              <div>{product?.description}</div>
            </div>
          </div>
          <div className="flex flex-col w-[40%] border rounded bg-white">
            <h2 className="p-[24px] pt-[16px] pb-[16px] text-[22px] font-semibold">
              Tin tức
            </h2>
          </div>
        </div>
        <div className="w-full">
          <div className="bg-white rounded">
            <div className="p-[24px]">
              <h1 className=" text-[24px] font-semibold">
                Đánh giá & Nhận xét {product?.title}
              </h1>
              <div className="flex justify-center gap-[32px] mt-[12px]">
                <div className="flex justify-center items-center">
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

                <div className="flex flex-col gap-1">
                  {Array.from(Array(5).keys())
                    .reverse()
                    .map((element) => (
                      <RatingBar
                        key={element}
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
              <div className="border-t  ">
                <div className="flex items-center justify-center flex-col gap-2 mt-3">
                  <span>Hãy để lại đánh giá</span>
                  <Button handleOnClick={handlePostReview}>
                    Đánh giá ngay
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  {product?.reviews?.map((element) => (
                    <Comment
                      key={element._id}
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
      </div>
    </>
  );
};

export default ProductDetail;
