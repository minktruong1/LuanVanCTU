import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    //Starting action
    builder.addCase(actions.apiGetCategories.pending, (state) => {
      //turn on loading
      state.isLoading = true;
    });

    //When action success (Promise fulfilled)
    builder.addCase(actions.apiGetCategories.fulfilled, (state, action) => {
      // console.log(action);
      state.isLoading = false;
      //payload."categories"=> collection name
      state.categories = action.payload;
    });

    //When action fail (Promise rejected)
    builder.addCase(actions.apiGetCategories.rejected, (state, action) => {
      //Turn off loading, save error into store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

// export const {} = appSlice.actions;

export default appSlice.reducer;
