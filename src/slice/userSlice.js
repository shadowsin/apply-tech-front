import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
  users: [],
  modal: {
    show: false,
    data: null,
  },
  skillModal: {
    show: false,
    data: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setModal: (state, action) => {
      state.modal = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSkillModal: (state, action) => {
      state.skillModal = action.payload;
    },
  },
});

export const { setUser, setModal, setUsers, setSkillModal } = userSlice.actions;

export default userSlice.reducer;
