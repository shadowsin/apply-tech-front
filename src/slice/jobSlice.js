import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  jobsResult: [],
  modal: {
    show: false,
    data: null,
  },
  notificationModal: {
    show: false,
    data: null,
  },
  createModal: {
    show: false,
    data: null,
  },
  jobSelected: null,
  appliedModal: {
    open: false,
    data: null,
  },
  viewDetailCV: {
    open: false,
    data: null,
  },
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.modal = action.payload;
    },
    notificationModal: (state, action) => {
      state.notificationModal = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setJobsResult: (state, action) => {
      state.jobsResult = action.payload;
    },
    setCreateModal: (state, action) => {
      state.createModal = action.payload;
    },
    setJobSelected: (state, action) => {
      state.jobSelected = action.payload;
    },
    setAppliedModal: (state, action) => {
      state.appliedModal = action.payload;
    },
    setViewDetailCV: (state, action) => {
      state.viewDetailCV = action.payload;
    },
    setJobApplied: (state, action) => {
      const dataApply = action.payload.job;

      const dataUpdated = {
        ...dataApply,
      };
      state.jobSelected = dataUpdated;
      const index = state.jobs.findIndex((j) => j._id === dataApply._id);
      if (index !== -1) {
        state.jobs[index] = dataUpdated;
      }
    },
  },
});

export const {
  showModal,
  notificationModal,
  setCreateModal,
  setJobs,
  setJobSelected,
  setAppliedModal,
  setJobApplied,
  setJobsResult,
  setViewDetailCV,
} = jobSlice.actions;
export default jobSlice.reducer;
