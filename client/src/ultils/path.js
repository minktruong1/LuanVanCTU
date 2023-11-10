const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  PRODUCTS: ":category",
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
  MAIN_CART: "main-cart",
  BLOGS: "blogs",
  BLOG_DETAIL: "blogs/:bid/:slug",
  OUR_SERVICES: "services",
  COUPONS: "coupons",
  PAYMENT_INSTRUCTION: "payment_instruction",
  FAQS: "faqs",
  PRODUCT_DETAIL__CATEGORY__PID__TITLE: ":category/:pid/:slug",
  PRODUCT_DETAIL: "product",
  LAST_REGISTER: "last-register/:status",
  RESET_PASSWORD: "reset-password/:token",
  CHECKOUT: "checkout",
  SEARCH: "search",

  //admin path
  ADMIN: "admin",
  PRODUCT_DASHBOARD: "product-dashboard",
  ORDER_DASHBOARD: "order-dashboard",
  MANAGE_USER: "manage-user",
  MANAGE_PRODUCT: "manage-products",
  CREATE_PRODUCT: "create-product",
  MANAGE_ORDER: "manage-orders",
  MANAGE_CATE: "manage-cate",
  MANAGE_BLOG: "manage-blog",
  CREATE_BLOG: "create-blog",
  MANAGE_COUPON: "manage-coupon",
  CREATE_COUPON: "create-coupon",
  CREATE_CATEGORY: "create-category",

  //customer path
  CUSTOMER: "customer",
  PROFILE: "profile",
  ORDER_HISTORY: "order-history",
  FAV_PRODUCTS: "favorite-list",
  HAVE_CHECK_PRODUCTS: "checked-products",
};

export default path;
