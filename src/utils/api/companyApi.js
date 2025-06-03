import axiosClient from "./axiosClient";

export const companyApi = {
  getCompany: (companyId) => axiosClient.get(`company/${companyId}`),
  getCompanyByAuth: () => axiosClient.get(`company/auth`),
  createCompany: (company) => axiosClient.post("company", company),
  getCompanies: () => axiosClient.get("company"),
  getCompanyJobs: (companyId) => axiosClient.get(`company/${companyId}/jobs`),
  deleteCompany: (companyId) => axiosClient.delete(`company/${companyId}`),
  updateCompany: ({ id, company }) => axiosClient.put(`company/${id}`, company),
};
