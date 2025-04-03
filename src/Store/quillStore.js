import { configureStore } from "@reduxjs/toolkit";
import quillAuthSlice from "../Store/quillAuthSlice";
import quillUserSlice from "../Store/quillUserSlice";

const QuillStore = configureStore({
  reducer: {
    quillquest: quillAuthSlice,
    user: quillUserSlice,
  },
});

export default QuillStore;
