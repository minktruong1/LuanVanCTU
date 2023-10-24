import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const apiGetBlogList = createAsyncThunk(
  "blog/getAll",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetAllBlogs();

    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.blogs;
  }
);
