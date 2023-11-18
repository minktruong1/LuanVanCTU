import path from "./path";
import icons from "./icons.js";
import { FaChartBar, FaShoppingBag } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { BsBagHeartFill, BsYoutube } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";

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
    path: `/categories/all-products`,
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
    icon: <BsYoutube />,
    value: "Kênh youtube",
    path: `/`,
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
    type: "PARENT",
    text: "Thống kê",
    submenu: [
      {
        text: "Về sản phẩm",
        path: `/${path.ADMIN}/${path.PRODUCT_DASHBOARD}`,
      },
      {
        text: "Về đơn hàng",
        path: `/${path.ADMIN}/${path.ORDER_DASHBOARD}`,
      },
      {
        text: "Về lợi nhuận",
        path: `/${path.ADMIN}/${path.PROFIT_DASHBOARD}`,
      },
    ],
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
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
      },
    ],
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Quản lý đơn hàng",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
  },
  {
    id: 5,
    type: "PARENT",
    text: "Quản lý bài viết",
    submenu: [
      {
        text: "Thêm bài viết",
        path: `/${path.ADMIN}/${path.CREATE_BLOG}`,
      },
      {
        text: "Danh sách bài viết",
        path: `/${path.ADMIN}/${path.MANAGE_BLOG}`,
      },
    ],
  },
  {
    id: 6,
    type: "PARENT",
    text: "Quản lý nhóm sản phẩm",
    submenu: [
      {
        text: "Thêm nhóm",
        path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`,
      },
      {
        text: "Danh sách nhóm",
        path: `/${path.ADMIN}/${path.MANAGE_CATE}`,
      },
    ],
  },
  {
    id: 7,
    type: "PARENT",
    text: "Quản lý mã giảm giá",
    submenu: [
      {
        text: "Thêm mã giảm giá",
        path: `/${path.ADMIN}/${path.CREATE_COUPON}`,
      },
      {
        text: "Danh sách mã giảm giá",
        path: `/${path.ADMIN}/${path.MANAGE_COUPON}`,
      },
    ],
  },
  {
    id: 8,
    type: "PARENT",
    text: "Quản Kho ảnh",
    submenu: [
      {
        text: "Thêm kho ảnh",
        path: `/${path.ADMIN}/${path.CREATE_IMG_STORE}`,
      },
      {
        text: "Danh sách kho ảnh",
        path: `/${path.ADMIN}/${path.MANAGE_IMG_STORE}`,
      },
    ],
  },
];

export const customerSidebar = [
  {
    id: 1,
    text: "Thông tin tài khoản",
    path: `/${path.CUSTOMER}/${path.PROFILE}`,
    icon: <BiSolidUser />,
  },
  {
    id: 1,
    text: "Đổi mật khẩu",
    path: `/${path.CUSTOMER}/${path.CHANGE_PASSWORD}`,
    icon: <RiLockPasswordFill />,
  },
  {
    id: 2,
    text: "Quản lý đơn hàng",
    path: `/${path.CUSTOMER}/${path.ORDER_HISTORY}`,
    icon: <FaShoppingBag />,
  },
  {
    id: 3,
    text: "Danh sách yêu thích",
    path: `/${path.CUSTOMER}/${path.FAV_PRODUCTS}`,
    icon: <BsBagHeartFill />,
  },
  {
    id: 4,
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
