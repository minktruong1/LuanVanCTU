const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  PRODUCTS: ":category",
  LOGIN: "login",
  MAIN_CART: "main-cart",
  BLOGS: "blogs",
  BLOG_DETAIL: "blogs/:bid/:title",
  OUR_SERVICES: "services",
  WARRANTY: "warranty",
  COUPONS: "coupons",
  PAYMENT_INSTRUCTION: "payment_instruction",
  FAQS: "faqs",
  PRODUCT_DETAIL__CATEGORY__PID__TITLE: ":category/:pid/:title",
  PRODUCT_DETAIL: "product",
  LAST_REGISTER: "last-register/:status",
  RESET_PASSWORD: "reset-password/:token",
  CHECKOUT: "checkout",
  SEARCH: "search",

  //admin path
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  MANAGE_USER: "manage-user",
  MANAGE_PRODUCTS: "manage-products",
  MANAGE_ORDERS: "manage-orders",
  CREATE_PRODUCT: "create-product",
  MANAGE_CATE: "manage-cate",
  MANAGE_BLOG: "manage-blog",

  //customer path
  CUSTOMER: "customer",
  PROFILE: "profile",
  ORDER_HISTORY: "order-history",
  FAV_PRODUCTS: "favorite-list",
  HAVE_CHECK_PRODUCTS: "checked-products",
};

export default path;
