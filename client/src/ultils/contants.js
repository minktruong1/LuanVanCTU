import path from "./path";
import icons from "./icons.js";

const {
  TiTags,
  BsNewspaper,
  RxVideo,
  MdOutlinePayment,
  PiHandCoins,
  BsShieldCheck,
} = icons;

export const navigation = [
  {
    id: 1,
    icon: <TiTags />,
    value: "Mã khuyến mãi",
    path: `/${path.COUPONS}`,
  },
  {
    id: 2,
    icon: <BsNewspaper />,
    value: "Tin tức công nghệ",
    path: `/${path.BLOGS}`,
  },
  {
    id: 3,
    icon: <RxVideo />,
    value: "Video",
    path: `/${path.VIDEO}`,
  },
  {
    id: 4,
    icon: <MdOutlinePayment />,
    value: "Hướng dẫn thanh toán",
    path: `/${path.PAYMENT_INSTRUCTION}`,
  },
  {
    id: 5,
    icon: <PiHandCoins />,
    value: "Hướng dẫn trả góp",
    path: `/${path.INSTALLMENT_INSTRUCTION}`,
  },
  {
    id: 6,
    icon: <BsShieldCheck />,
    value: "Chính sách bảo hành",
    path: `/${path.FAQS}`,
  },
];
