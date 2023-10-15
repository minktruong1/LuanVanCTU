import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const apiGetCurrentAccount = createAsyncThunk(
  "user/current",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCurrentUser();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.getUser;
  }
);
