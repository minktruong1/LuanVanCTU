import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    currentData: null,
    token: null,
    isLoading: false,
    message: "",
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = action.payload.isLogin;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLogin = false;
      state.token = null;
    },
    clearMessage: (state) => {
      state.message = "";
    },
  },
  // Code xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.apiGetCurrentAccount.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(actions.apiGetCurrentAccount.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentData = action.payload;
      state.isLogin = true;
    });

    builder.addCase(actions.apiGetCurrentAccount.rejected, (state, action) => {
      state.isLoading = false;
      state.currentData = null;
      state.isLogin = false;
      state.token = null;
      state.message = "Phiên đăng nhập hết hạn";
    });
  },
});

export const { login, logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;
