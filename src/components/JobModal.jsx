import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";

import { setCreateModal, setJobs } from "../slice/jobSlice";
import { data } from "../sources/data";
import { address } from "../actions/userAddress";
import { jobApi } from "../utils/api/jobApi";
import CompanyAddress from "./CompanyAddress";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const JobModal = () => {
  const { show: open, data: dataUpdate } = useSelector(
    (state) => state.job.createModal
  );
  const { user } = useSelector((state) => state.user);
  const { companies: companyData } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    company: dataUpdate?.company?._id || "",
    jobStatus: dataUpdate?.company?.active || 0,
    workingForm: dataUpdate?.job?.workingForm || "Online",
    salary: dataUpdate?.company?.salary || "Thỏa thuận",
    scale: dataUpdate?.job?.scale || "Dưới 1km",
    time: "Toàn thời gian",
    jobLocation_str: dataUpdate?.job?.jobLocation_str || "",
  });
  const [companyAuth, setCompanyAuth] = useState(dataUpdate?.job?.company);
  const [isChangeAddress, setIsChangeAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  
  useEffect(() => {
  if (user.role === "company") {
    const currentCompany = companyData.find(
      (c) => c.author === user._id
    );
    setCompanyAuth(currentCompany);
  }
}, [user, companyData]);

  useEffect(() => {
    if (!dataUpdate?.job?.company && companyData.length && formValues.company) {
      setCompanyAuth(companyData.find((c) => c._id === formValues.company));
    }
  }, [dataUpdate, companyData, formValues.company]);

  const handleClose = () => {
    dispatch(setCreateModal({ show: false, data: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      author: user.role === "admin" ? companyAuth?.author : user._id,
      jobTitle: formData.get("jobTitle"),
      jobDescription: formData.get("jobDescription"),
      jobSkills: formData.get("jobSkills"),
      jobLocation: newAddress ?? companyAuth?.address,
      wotkingForm: formValues.workingForm,
      salary: formValues.salary,
      scale: formValues.scale,
      company: companyAuth?._id || formValues.company,
      jobStatus: formValues.jobStatus,
      time: formValues.time,
      jobLocation_str: formValues.jobLocation_str,
    };

    if (data.jobTitle.length < 10) {
      return toast.error("Tên công việc phải dài ít nhất 10 ký tự");
    }
    if (data.jobDescription.length < 10) {
      return toast.error("Mô tả công việc phải dài ít nhất 10 ký tự");
    }

    try {
      await toast.promise(
        dataUpdate
          ? jobApi.updateJob({ ...data, _id: dataUpdate.job._id })
          : jobApi.createJob(data),
        {
          loading: dataUpdate ? "Đang cập nhật..." : "Đang tạo...",
          success: dataUpdate ? "Cập nhật thành công!" : "Tạo thành công!",
          error: dataUpdate ? "Cập nhật thất bại" : "Tạo thất bại",
        }
      );
      const jobs = await jobApi.getJobsByRoot();
      dispatch(setJobs(jobs));
      handleClose();
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="job-modal-title">
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography
          id="job-modal-title"
          variant="h6"
          align="center"
          sx={{ fontWeight: 600, mb: 2 }}
        >
          {dataUpdate ? "Cập nhật công việc" : "Thêm công việc mới"}
        </Typography>

        {user.role === "admin" &&  (
          <FormControl fullWidth required>
            <InputLabel>Công ty</InputLabel>
            <Select
              value={formValues.company}
              label="Công ty"
              onChange={handleInputChange("company")}
            >
              {companyData?.map((data) => (
                <MenuItem key={data._id} value={data._id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Tên công việc"
          name="jobTitle"
          defaultValue={dataUpdate?.job?.jobTitle}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Mô tả công việc"
          name="jobDescription"
          defaultValue={dataUpdate?.job?.jobDescription}
          fullWidth
          multiline
          rows={4}
          required
          margin="normal"
        />
        <TextField
          label="Kỹ năng cần có"
          name="jobSkills"
          defaultValue={dataUpdate?.job?.jobSkills}
          placeholder="React, Node, PHP, ..."
          fullWidth
          required
          margin="normal"
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isChangeAddress ? (
            <CompanyAddress setInitialAddress={setNewAddress} />
          ) : (
            <TextField
              disabled
              value={
                companyAuth?.address
                  ? address(companyAuth?.address)
                  : address(dataUpdate?.job?.jobLocation)
              }
              name="jobLocation"
              fullWidth
              required
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setIsChangeAddress(!isChangeAddress)}
          >
            {isChangeAddress ? "Hủy" : "Thay đổi"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <FormControl>
            <FormLabel>Trạng thái</FormLabel>
            <RadioGroup
              value={formValues.jobStatus}
              onChange={handleInputChange("jobStatus")}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Hoạt động"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Không hoạt động"
              />
            </RadioGroup>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Hình thức làm việc</InputLabel>
            <Select
              value={formValues.workingForm}
              label="Hình thức làm việc"
              onChange={handleInputChange("workingForm")}
            >
              {data?.workForm.map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Thời gian làm việc</InputLabel>
            <Select
              value={formValues.time}
              label="Thời gian làm việc"
              onChange={handleInputChange("time")}
            >
              {data.time.map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Mức lương</InputLabel>
            <Select
              value={formValues.salary}
              label="Mức lương"
              onChange={handleInputChange("salary")}
            >
              {data.salary.map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="contained" color="success" fullWidth type="submit">
            Lưu
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleClose}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobModal;
