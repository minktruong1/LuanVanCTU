import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
