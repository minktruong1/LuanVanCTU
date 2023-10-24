import path from "./path";
import icons from "./icons.js";
import { FaChartBar, FaShoppingBag } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { BsBagHeartFill } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";

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
    path: `/all-products`,
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

export const starOptions = [
  {
    id: 1,
    text: "Kém",
  },
  {
    id: 2,
    text: "Tệ",
  },
  {
    id: 3,
    text: "Bình thường",
  },
  {
    id: 4,
    text: "Tốt",
  },
  {
    id: 5,
    text: "Rất tốt",
  },
];

export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thống kê",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <FaChartBar />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Quản lý tài khoản",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Quản lý sản phẩm",
    submenu: [
      {
        text: "Tạo sản phẩm mới",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
      },
      {
        text: "Danh sách sản phẩm",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Quản lý đơn hàng",
    path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
  },
  {
    id: 5,
    type: "SINGLE",
    text: "Quản lý bài viết",
    path: `/${path.ADMIN}/${path.MANAGE_BLOG}`,
  },
  {
    id: 6,
    type: "SINGLE",
    text: "Quản lý danh mục sản phẩm",
    path: `/${path.ADMIN}/${path.MANAGE_CATE}`,
  },
];

export const customerSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thông tin tài khoản",
    path: `/${path.CUSTOMER}/${path.PROFILE}`,
    icon: <BiSolidUser />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Quản lý đơn hàng",
    path: `/${path.CUSTOMER}/${path.ORDER_HISTORY}`,
    icon: <FaShoppingBag />,
  },
  {
    id: 3,
    type: "SINGLE",
    text: "Danh sách yêu thích",
    path: `/${path.CUSTOMER}/${path.FAV_PRODUCTS}`,
    icon: <BsBagHeartFill />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Sản phẩm đã xem",
    path: `/${path.CUSTOMER}/${path.HAVE_CHECK_PRODUCTS}`,
    icon: <AiFillEye />,
  },
];

export const userRole = [
  {
    value: "admin",
    text: "admin",
  },
  {
    value: "user",
    text: "user",
  },
];

export const userStatus = [
  {
    value: true,
    text: "block",
  },
  {
    value: false,
    text: "active",
  },
];
