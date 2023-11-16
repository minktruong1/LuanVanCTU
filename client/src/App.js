import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Public,
  Blogs,
  Products,
  ProductDetail,
  Faqs,
  PaymentInstruction,
  RsPassword,
  MainCart,
  Checkout,
  BlogDetail,
  SearchProduct,
  ForgotPassword,
  Register,
  NotFound,
} from "./pages/public/index.js";
import path from "./ultils/path.js";
import { apiGetCateList } from "./store/app/asyncActions.js";
import { apiGetBlogList } from "./store/blogs/asyncActions.js";
import { useDispatch, useSelector } from "react-redux";
import CouponsList from "./pages/public/CouponsList.js";
import Modal from "./components/Modal.js";
import {
  AdminLayout,
  CreateBlog,
  CreateCategory,
  CreateCoupon,
  CreateProduct,
  ManageBlog,
  ManageCate,
  ManageCoupon,
  ManageOrders,
  ManageProducts,
  ManageUsers,
  OrderDashboard,
  ProductDashboard,
  ProfitDashboard,
} from "./pages/admin/";

import {
  CustomerLayout,
  Profile,
  FavoriteProducts,
  OrderHistory,
  CheckedProductList,
  ChangePassword,
} from "./pages/customer/index.js";

//About toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiGetNewProduct } from "./store/products/asyncActions.js";

function App() {
  const dispatch = useDispatch();

  const { isShowModal, modalContent } = useSelector(
    (state) => state.appReducer
  );

  useEffect(() => {
    dispatch(apiGetCateList());
    dispatch(apiGetNewProduct());
    dispatch(apiGetBlogList());
  }, []);

  return (
    <div className="w-full font-main relative text-sm md:text-base">
      {isShowModal && <Modal>{modalContent}</Modal>}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route
            path={path.PRODUCT_DETAIL__CATEGORY__PID__TITLE}
            element={<ProductDetail />}
          ></Route>
          <Route path={path.BLOGS} element={<Blogs />}></Route>
          <Route path={path.BLOG_DETAIL} element={<BlogDetail />}></Route>
          <Route path={path.PRODUCTS} element={<Products />}></Route>
          <Route path={path.FAQS} element={<Faqs />}></Route>
          <Route path={path.COUPONS} element={<CouponsList />}></Route>
          <Route
            path={path.PAYMENT_INSTRUCTION}
            element={<PaymentInstruction />}
          ></Route>
          <Route path={path.LOGIN} element={<Login />}></Route>
          <Route
            path={path.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          ></Route>
          <Route path={path.REGISTER} element={<Register />}></Route>
          <Route path={path.MAIN_CART} element={<MainCart />}></Route>
          <Route path={path.RESET_PASSWORD} element={<RsPassword />}></Route>
          <Route path={path.CHECKOUT} element={<Checkout />}></Route>
          <Route path={path.SEARCH} element={<SearchProduct />}></Route>
        </Route>

        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.PRODUCT_DASHBOARD} element={<ProductDashboard />} />
          <Route path={path.ORDER_DASHBOARD} element={<OrderDashboard />} />
          <Route path={path.PROFIT_DASHBOARD} element={<ProfitDashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrders />} />
          <Route path={path.MANAGE_PRODUCT} element={<ManageProducts />} />
          <Route path={path.MANAGE_USER} element={<ManageUsers />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
          <Route path={path.MANAGE_BLOG} element={<ManageBlog />} />
          <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
          <Route path={path.MANAGE_CATE} element={<ManageCate />} />
          <Route path={path.MANAGE_COUPON} element={<ManageCoupon />} />
          <Route path={path.CREATE_COUPON} element={<CreateCoupon />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
        </Route>

        <Route path={path.CUSTOMER} element={<CustomerLayout />}>
          <Route path={path.PROFILE} element={<Profile />} />
          <Route path={path.FAV_PRODUCTS} element={<FavoriteProducts />} />
          <Route path={path.ORDER_HISTORY} element={<OrderHistory />} />
          <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route
            path={path.HAVE_CHECK_PRODUCTS}
            element={<CheckedProductList />}
          />
        </Route>
        <Route path={path.ALL} element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
