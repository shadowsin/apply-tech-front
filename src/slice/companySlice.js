import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],
  modal: {
    show: false,
    data: null,
  },
  companyAuthor: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setModal: (state, action) => {
      state.modal = action.payload;
    },
    setCompanyAuthor: (state, action) => {
      state.companyAuthor = action.payload;
    },
  },
});

export const { setCompanies, setModal, setCompanyAuthor } =
  companySlice.actions;
export default companySlice.reducer;
