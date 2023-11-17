import React, { memo } from "react";
import { Link } from "react-router-dom";
import icons from "../ultils/icons.js";
import footerShip1 from "../assets/footerShip.png";
import footerShip2 from "../assets/footerShip1.png";
import footerPayment from "../assets/paymentWay.jpg";
import footerPayment1 from "../assets/paymentWay1.jpg";
import legit from "../assets/legit.png";

const about = [
  { id: 1, title: "Giới thiệu" },
  { id: 2, title: "Tuyển dụng" },
];

const policy = [
  { id: 1, title: "Chính sách bảo hành" },
  { id: 2, title: "Chính sách thanh toán" },
  { id: 3, title: "Chính sách giao hàng" },
  { id: 4, title: "Chính sách bảo mật" },
];

const detail = [
  { id: 1, title: "Hệ thống cửa hàng" },
  { id: 2, title: "Trung tâm bảo hành" },
];

const { BsFacebook, BsYoutube, AiFillInstagram, AiFillTwitterCircle } = icons;

const Footer = () => {
  return (
    <div className="w-full bg-white flex border-t-2 border-main justify-center pb-4 ">
      <div className="md:w-main mb-[50px] md:m-0 w-[1200px] px-5 md:px-2">
        <div className="grid grid-cols-2 md:grid-cols-5 mt-[22px] mb-[22px]">
          <div>
            <div className="font-semibold mb-[8px]">VỀ GGEAR</div>
            <div className="grid grid-rows-1">
              {about.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]">
                  {Element.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-[8px]">CHÍNH SÁCH</div>
            <div className="grid grid-rows-1 text-[13px] md:text-base">
              {policy.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]">
                  {Element.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-row font-semibold mb-[8px]">
              THÔNG TIN
            </div>
            <div className="grid grid-rows-1 text-[13px] md:text-base">
              {detail.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]">
                  {Element.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="grid grid-rows-1">
              <div className="font-semibold mb-[8px]">TỔNG ĐÀI HỖ TRỢ</div>
              <p className="text-[13px] md:text-base">
                Gọi mua: 1800.6975 (8:00 - 21:00)
              </p>
              <p className="text-[13px] md:text-base">
                CSKH: 1800.6173 (8:00 - 21:00)
              </p>
              <p className="text-[13px] md:text-base">Email: cskh@ggear.com</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="grid grid-rows-1">
              <div className="font-semibold mb-[8px]">ĐƠN VỊ VẬN CHUYỂN</div>
              <div className="grid grid-cols-2">
                <img alt="" src={footerShip1} className="border" />
                <img alt="" src={footerShip2} className="border" />
              </div>
              <div className="font-semibold mb-[8px]">CÁCH THỨC THANH TOÁN</div>
              <div className="grid grid-cols-2">
                <img alt="" src={footerPayment} className="border" />
                <img alt="" src={footerPayment1} className="border" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 pt-[18px] pb-[18px] border-t">
          <div className="flex items-center ">
            <span className="mr-[8px]">Kết nối:</span>
            <div className="flex items-center text-[30px]">
              <span className="pr-[6px] text-[#31629f]">
                <BsFacebook />
              </span>
              <span className="pr-[6px] text-[#b93523]">
                <BsYoutube />
              </span>
              <span className="pr-[6px] text-[#1d9bf0]">
                <AiFillTwitterCircle />
              </span>
            </div>
          </div>
          <div className="">
            <img alt="" src={legit} width={`130px`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
