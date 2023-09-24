import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import userSlice from "./users/userSlice";

const config = {
  key: "shop/user",
  storage,
};

const userConfig = {
  ...config,
  whitelist: ["isLogin", "token"],
};

export const store = configureStore({
  reducer: {
    appReducer: appSlice,
    products: productSlice,
    user: persistReducer(userConfig, userSlice),
  },
});

export const persistor = persistStore(store);
