import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogList: null,
  },
  reducers: {},
  //   Code xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.apiGetBlogList.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(actions.apiGetBlogList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogList = action.payload;
    });

    builder.addCase(actions.apiGetBlogList.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default blogSlice.reducer;
