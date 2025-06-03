import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  popup: false,
  user: {
    user: {
      _id: "",
      name: "",
      avatar: "",
    },
    lastMessage: "",
    time: "",
    seen: false,
  },

  aiChat: [],

  messages: [],

  userChat: [],

  loading: false,
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    selectUser: (state, action) => {
      state.user = action.payload;
    },
    setPopup: (state, action) => {
      state.popup = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    setAiChat: (state, action) => {
      state.aiChat = [...state.aiChat, action.payload];
    },
  },
});

export const { selectUser, setPopup, setMessages, setAiChat } =
  messageSlice.actions;
export default messageSlice.reducer;
