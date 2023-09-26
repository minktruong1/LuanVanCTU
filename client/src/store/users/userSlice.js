import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    currentData: null,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      console.log(action);
      state.isLogin = action.payload.isLogin;
      state.currentData = action.payload.userData;
      state.token = action.payload.token;
    },
  },
  //   Code xử lý async action
  //   extraReducers: (builder) => {
  //     builder.addCase(actions.apiGetNewProduct.pending, (state) => {
  //       state.isLoading = true;
  //     });

  //     builder.addCase(actions.apiGetNewProduct.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.justOnSellProducts = action.payload;
  //     });

  //     builder.addCase(actions.apiGetNewProduct.rejected, (state, action) => {
  //       state.isLoading = false;
  //       state.errorMessage = action.payload.message;
  //     });
  //   },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
