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
  LastRegister,
  RsPassword,
} from "./pages/public/index.js";
import path from "./ultils/path.js";
import { apiGetCategories } from "./store/app/asyncActions.js";
import { useDispatch, useSelector } from "react-redux";
import Warranty from "./pages/public/Warranty.js";
import CouponsList from "./pages/public/CouponsList.js";
import Modal from "./components/Modal.js";
import {
  AdminLayout,
  CreateProduct,
  Dashboard,
  ManageOrders,
  ManageProducts,
  ManageUsers,
} from "./pages/admin/index.js";
import { CustomerLayout, Profile } from "./pages/customer/index.js";

//About toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  const { isShowModal, modalContent } = useSelector(
    (state) => state.appReducer
  );

  useEffect(() => {
    dispatch(apiGetCategories());
  }, []);

  return (
    <div className="min-h-screen font-main relative">
      {isShowModal && <Modal>{modalContent}</Modal>}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />

      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route
            path={path.PRODUCT_DETAIL__CATEGORY__PID__TITLE}
            element={<ProductDetail />}
          ></Route>
          <Route path={path.PRODUCTS} element={<Products />}></Route>
          <Route path={path.BLOGS} element={<Blogs />}></Route>
          <Route path={path.FAQS} element={<Faqs />}></Route>
          <Route path={path.COUPONS} element={<CouponsList />}></Route>
          <Route
            path={path.PAYMENT_INSTRUCTION}
            element={<PaymentInstruction />}
          ></Route>
          <Route path={path.WARRANTY} element={<Warranty />}></Route>
          <Route path={path.LOGIN} element={<Login />}></Route>
          <Route path={path.RESET_PASSWORD} element={<RsPassword />}></Route>
          <Route path={path.ALL} element={<Home />}></Route>
        </Route>

        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_USER} element={<ManageUsers />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
        </Route>

        <Route path={path.CUSTOMER} element={<CustomerLayout />}>
          <Route path={path.PROFILE} element={<Profile />} />
        </Route>

        <Route path={path.LAST_REGISTER} element={<LastRegister />}></Route>
      </Routes>
    </div>
  );
}

export default App;
