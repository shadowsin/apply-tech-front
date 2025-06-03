import axiosClient from "./axiosClient";

export const jobApi = {
  getJobs: () => axiosClient.get(`jobs`),
  getJobsByRoot: () => axiosClient.get(`jobs/root`),
  createJob: (job) => axiosClient.post("jobs", job),
  deleteJob: (jobId) => axiosClient.delete(`jobs/${jobId}`),
  updateJob: (job) => axiosClient.put(`jobs/${job._id}`, job),
  cvApplied: (jobId) => axiosClient.get(`jobs/applied/${jobId}`),
  updateStatusCV: (jobId, status) =>
    axiosClient.put(`jobs/applied/${jobId}/status`, status),
  updateViewCV: (jobId) => axiosClient.put(`jobs/applied/${jobId}/view`),
  searchJobs: ({ title, salary, scale, wotkingForm, time }) => {
    const params = new URLSearchParams();

    if (salary) params.append("salary", salary);
    if (scale) params.append("scale", scale);
    if (wotkingForm) params.append("wotkingForm", wotkingForm);
    if (time) params.append("time", time);

    return axiosClient.get(`jobs/search/${title}?${params.toString()}`);
  },
};
