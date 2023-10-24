import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
    isShowModal: false,
    modalContent: null,
    isShowCartPopup: false,
    isShowUserDirection: false,
    isShowAdminSidebar: false,
  },
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalContent = action.payload.modalContent;
    },
    showCartPopup: (state) => {
      state.isShowCartPopup = state.isShowCartPopup === false ? true : false;
    },
    showUserDirection: (state) => {
      state.isShowUserDirection =
        state.isShowUserDirection === false ? true : false;
    },
    showAdminSidebar: (state) => {
      state.isShowAdminSidebar =
        state.isShowAdminSidebar === false ? true : false;
    },
  },

  extraReducers: (builder) => {
    //Starting action
    builder.addCase(actions.apiGetCateList.pending, (state) => {
      //turn on loading
      state.isLoading = true;
    });

    //When action success (Promise fulfilled)
    builder.addCase(actions.apiGetCateList.fulfilled, (state, action) => {
      // console.log(action);
      state.isLoading = false;
      //payload."categories"=> collection name
      state.categories = action.payload;
    });

    //When action fail (Promise rejected)
    builder.addCase(actions.apiGetCateList.rejected, (state, action) => {
      //Turn off loading, save error into store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export const { showModal, showCartPopup, showAdminSidebar, showUserDirection } =
  appSlice.actions;

export default appSlice.reducer;
