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
    <div className="w-full">
      <div className="w-full bg-white flex border-t-2 justify-center">
        <div className="w-main">
          <div className="flex flex-row mt-[22px] mb-[22px]">
            <div className="flex flex-col w-1/3">
              <div className="flex flex-row font-semibold mb-[8px]">
                VỀ GGEAR
              </div>
              {about.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]"
                >
                  {Element.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col w-1/3">
              <div className="flex flex-row font-semibold">CHÍNH SÁCH</div>
              {policy.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]"
                >
                  {Element.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col w-1/3">
              <div className="flex flex-row font-semibold">THÔNG TIN</div>
              {detail.map((Element, index) => (
                <Link
                  key={index}
                  className="hover:underline hover:text-red-600 pb-[6px]"
                >
                  {Element.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row font-semibold">TỔNG ĐÀI HỖ TRỢ</div>
              <p>Gọi mua: 1800.6975 (8:00 - 21:00)</p>
              <p>CSKH: 1800.6173 (8:00 - 21:00)</p>
              <p>Email: cskh@gearvn.com</p>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row font-semibold">
                <span>ĐƠN VỊ VẬN CHUYỂN</span>
              </div>
              <div className="flex flex-row">
                <img alt="" src={footerShip1} />
                <img alt="" src={footerShip2} />
              </div>
              <div className="flex flex-row font-semibold">
                <span>CÁCH THỨC THANH TOÁN</span>
              </div>
              <div className="flex flex-row">
                <img alt="" src={footerPayment} />
                <img alt="" src={footerPayment1} />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between pt-[18px] pb-[18px] border-t">
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
            <div>
              <img alt="" src={legit} width={`130px`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
