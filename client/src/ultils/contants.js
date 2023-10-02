import path from "./path";
import icons from "./icons.js";

const {
  TiTags,
  BsNewspaper,
  MdOutlinePayment,
  BsShieldCheck,
  FaQuestionCircle,
  FaListUl,
} = icons;

export const navigation = [
  {
    id: 1,
    icon: <BsNewspaper />,
    value: "Tin tức công nghệ",
    path: `/${path.BLOGS}`,
  },
  {
    id: 2,
    icon: <FaListUl />,
    value: "Tất cả sản phẩm",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    icon: <TiTags />,
    value: "Mã khuyến mãi",
    path: `/${path.COUPONS}`,
  },

  {
    id: 4,
    icon: <MdOutlinePayment />,
    value: "Hướng dẫn thanh toán",
    path: `/${path.PAYMENT_INSTRUCTION}`,
  },
  {
    id: 5,
    icon: <FaQuestionCircle />,
    value: "FAQS",
    path: `/${path.FAQS}`,
  },
  {
    id: 6,
    icon: <BsShieldCheck />,
    value: "Chính sách bảo hành",
    path: `/${path.WARRANTY}`,
  },
];

export const sorts = [
  {
    id: 1,
    value: "price",
    text: "Giá tăng dần",
  },
  {
    id: 2,
    value: "-price",
    text: "Giá giảm dần",
  },

  // {
  //   id: 3,
  //   value: "price",
  //   text: "Giá tăng dần",
  // },
];
