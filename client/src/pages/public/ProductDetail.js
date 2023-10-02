import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGetProductDetail } from "../../apis";
import { Breadcrumb, Button, QuantitySelector } from "../../components";
import Slider from "react-slick";
import { formatVND, pointToStar } from "../../ultils/helpers";
import icons from "../../ultils/icons";

const { GiCheckMark } = icons;

const reactSlickSetting = {
  dot: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const ProductDetail = () => {
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [chooseImage, setChooseImage] = useState(null);

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
    setChooseImage(element);
  };

  return (
    <>
      <div className="w-full ">
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
              <Slider {...reactSlickSetting} className="product-detail-slick">
                {product?.images?.map((element) => (
                  <div key={element} className="px-[8px]">
                    <img
                      onClick={(e) => handleChooseImage(e, element)}
                      src={element}
                      alt=""
                      className="h-[108px] w-[108px] object-cover rounded"
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
            <h1 className="text-[28px] text-[#e30019] font-semibold mb-[12px]">{`${formatVND(
              product?.price
            )} VNĐ`}</h1>
            <div className="mb-[30px]">
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
            <div className="pl-[24px] pr-[24px]">
              <h1 className="pt-[24px] pb-[24px] text-[24px] font-semibold">
                Đánh giá & Nhận xét {product?.title}
              </h1>
              <div>Comment and review</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
