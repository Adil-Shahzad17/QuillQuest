import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const quillAuthSlice = createSlice({
  name: "quillquest",
  initialState,
  reducers: {
    draftLogin: (state, action) => {
      state.userData = action.payload.userData;
    },
    login: (state, action) => {
      (state.status = true), (state.userData = action.payload.userData);
    },
    logout: (state) => {
      (state.status = false), (state.userData = null);
    },
  },
});

export const { draftLogin, login, logout } = quillAuthSlice.actions;

export default quillAuthSlice.reducer;
