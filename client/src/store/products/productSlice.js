import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    justOnSellProducts: null,
  },
  reducers: {},
  //   Code xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.apiGetNewProduct.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(actions.apiGetNewProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.justOnSellProducts = action.payload;
    });

    builder.addCase(actions.apiGetNewProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default productSlice.reducer;
