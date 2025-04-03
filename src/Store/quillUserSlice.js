import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const quillUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user_data: (state, action) => {
      state.userData = action.payload.userData;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { user_data, clearUserData } = quillUserSlice.actions;

export default quillUserSlice.reducer;
