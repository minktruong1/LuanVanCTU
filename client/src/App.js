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
import { useDispatch } from "react-redux";
import Warranty from "./pages/public/Warranty.js";
import CouponsList from "./pages/public/CouponsList.js";

//About toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(apiGetCategories());
  }, []);

  return (
    <div className="min-h-screen font-main">
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
            path={path.PRODUCT_DETAIL__PID__TITLE}
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
        </Route>
        <Route path={path.LAST_REGISTER} element={<LastRegister />}></Route>
      </Routes>
    </div>
  );
}

export default App;
