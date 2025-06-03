import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  createModal: {
    open: false,
    data: null,
  },
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    setFaqData: (state, action) => {
      state.data = action.payload;
    },
    setFaqCreateModal: (state, action) => {
      state.createModal = action.payload;
    },
  },
});

export const { setFaqData, setFaqCreateModal } = faqSlice.actions;

export default faqSlice.reducer;
