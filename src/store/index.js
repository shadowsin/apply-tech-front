import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/userSlice";
import jobSlice from "../slice/jobSlice";
import companySlice from "../slice/companySlice";
import notification from "../slice/notification";
import faqSlice from "../slice/faqSlice";
import messageSlice from "../slice/messageSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    job: jobSlice,
    company: companySlice,
    notification: notification,
    faq: faqSlice,
    messages: messageSlice,
  },
});
