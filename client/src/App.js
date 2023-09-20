import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Home, Public } from "./pages/public/index.js";
import path from "./ultils/path.js";
import { apiGetCategories } from "./store/app/asyncActions.js";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(apiGetCategories());
  }, []);

  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.LOGIN} element={<Login />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
