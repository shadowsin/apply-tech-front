import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import toast from "react-hot-toast";

import { setModal } from "../slice/companySlice";
import JobItem from "./JobItem";
import CompanyAddress from "./CompanyAddress";
import { companyApi } from "../utils/api/companyApi";
import { address as getAddress } from "../actions/userAddress";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "80%", lg: "max-content" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  gap: 4,
  flexWrap: "wrap",
  maxHeight: "90vh",
  overflowY: "auto",
};

const CompanyModal = () => {
  const { show: open, data: dataUpdate } = useSelector(
    (state) => state.company.modal
  );
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [jobsOfCompany, setJobsOfCompany] = useState([]);
  const [formValues, setFormValues] = useState({
    image: dataUpdate?.image || null,
    address: dataUpdate?.address || null,
    ot: dataUpdate?.ot === "Có tăng ca" ? 1 : 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (dataUpdate?._id) {
        const data = await companyApi.getCompanyJobs(dataUpdate._id);
        setJobsOfCompany(data);
      }
      setIsLoading(false);
    };
    fetchData();
    if (dataUpdate?.address) {
      setFormValues((prev) => ({ ...prev, address: dataUpdate.address }));
    }
  }, [dataUpdate]);

  const handleClose = () => {
    dispatch(setModal({ show: false, data: null }));
    setFormValues({ image: null, address: null, ot: 0 });
    setJobsOfCompany([]);
  };

  const handleDelete = async () => {
    try {
      await toast.promise(companyApi.deleteCompany(dataUpdate?._id), {
        loading: "Đang xóa...",
        success: "Xóa thành công!",
        error: "Xóa thất bại",
      });
      handleClose();
    } catch (error) {
      toast.error("Lỗi khi xóa công ty");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      image: formValues.image,
      name: formData.get("name"),
      address: formValues.address,
      country: formData.get("country"),
      website: formData.get("website"),
      social: formData.get("facebook"),
      description: formData.get("description"),
      scale: formData.get("scale"),
      ot: formValues.ot ? "Có tăng ca" : "Không tăng ca",
    };

    try {
      await toast.promise(
        dataUpdate
          ? companyApi.updateCompany({ id: dataUpdate._id, company: data })
          : companyApi.createCompany(data),
        {
          loading: dataUpdate ? "Đang cập nhật..." : "Đang tạo...",
          success: dataUpdate ? "Cập nhật thành công!" : "Tạo thành công!",
          error: dataUpdate ? "Cập nhật thất bại" : "Tạo thất bại",
        }
      );
      handleClose();
    } catch (error) {
      console.error("Error submitting company:", error);
    }
  };

  const handleFileUpload = (e) => {
    if (!e.type.includes("image")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }
    setFormValues((prev) => ({ ...prev, image: e.base64 }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="company-modal-title"
    >
      <Box sx={modalStyle}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: { xs: "100%", md: 400 },
            maxWidth: 500,
            maxHeight: 800,
            overflowY: "auto",
          }}
        >
          <Typography
            id="company-modal-title"
            variant="h6"
            align="center"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            {dataUpdate ? "Chỉnh sửa thông tin công ty" : "Tạo công ty mới"}
          </Typography>

          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 2,
            }}
          >
            {formValues.image && (
              <Box
                component="img"
                src={formValues.image}
                alt="Company logo"
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  height: "auto",
                  borderRadius: 1,
                  boxShadow: 1,
                  objectFit: "contain",
                }}
              />
            )}
            <FileBase64
              multiple={false}
              onDone={handleFileUpload}
              style={{
                width: "100%",
                maxWidth: 200,
                padding: 8,
                border: "2px dashed",
                borderColor: "primary.main",
                borderRadius: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "primary.50",
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: "primary.100" },
              }}
            />
          </Paper>

          <TextField
            label="Tên công ty"
            name="name"
            defaultValue={dataUpdate?.name}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Giới thiệu công ty"
            name="description"
            defaultValue={dataUpdate?.description}
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Quy mô"
              name="scale"
              defaultValue={dataUpdate?.scale}
              required
              sx={{ flex: "1 1 200px" }}
            />
            <TextField
              label="Quốc gia"
              name="country"
              defaultValue={dataUpdate?.country}
              required
              sx={{ flex: "1 1 200px" }}
            />
            <TextField
              label="Website"
              name="website"
              defaultValue={dataUpdate?.website}
              required
              sx={{ flex: "1 1 200px" }}
            />
            <TextField
              label="Facebook"
              name="facebook"
              defaultValue={dataUpdate?.social}
              required
              sx={{ flex: "1 1 200px" }}
            />
          </Box>

          <Paper elevation={3} sx={{ p: 2, my: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Địa chỉ hiện tại: <b>{getAddress(dataUpdate?.address) || "-"}</b>
            </Typography>
            <CompanyAddress
              setInitialAddress={(addr) =>
                setFormValues((prev) => ({ ...prev, address: addr }))
              }
            />
          </Paper>

          <FormControl>
            <FormLabel>Tăng ca</FormLabel>
            <RadioGroup
              value={formValues.ot}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, ot: +e.target.value }))
              }
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Không tăng ca"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Có tăng ca"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              type="submit"
              sx={{ flex: 1, minWidth: 120 }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClose}
              sx={{ flex: 1, minWidth: 120 }}
            >
              Hủy
            </Button>
            {dataUpdate && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleDelete}
                disabled={jobsOfCompany?.length > 0}
                sx={{ flex: 1, minWidth: 120 }}
              >
                {jobsOfCompany?.length > 0 ? (
                  <Typography variant="body2" fontStyle="italic">
                    Cần xóa hết công việc trước
                  </Typography>
                ) : (
                  "Xóa"
                )}
              </Button>
            )}
          </Box>
        </Box>

        {dataUpdate?._id && (
          <Box
            sx={{
              minWidth: { xs: "100%", md: 400 },
              maxWidth: 600,
              maxHeight: 800,
              overflowY: "auto",
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Công việc của công ty
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {jobsOfCompany?.length && !isLoading ? (
                jobsOfCompany.map((job) => <JobItem key={job._id} {...job} />)
              ) : isLoading ? (
                <LinearProgress
                  sx={{
                    minWidth: { xs: "100%", md: 400 },
                    maxWidth: 600,
                    maxHeight: 800,
                    overflowY: "auto",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Chưa có công việc nào
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CompanyModal;
