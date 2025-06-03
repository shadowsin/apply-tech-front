import { Box, Button, Chip, Divider, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setViewDetailCV } from "../slice/jobSlice";
import moment from "moment";
import { address } from "../actions/userAddress";
import { notificationApi } from "../utils/api/notificationApi";
import { jobApi } from "../utils/api/jobApi";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  maxHeight: "80vh",
  overflowY: "auto",
  borderRadius: 2,
};

const downloadLinkStyle = {
  color: "primary.main",
  textDecoration: "none",
  fontWeight: 500,
  "&:hover": {
    textDecoration: "underline",
  },
};

const DetailCVmodal = () => {
  const { open, data } = useSelector((state) => state.job.viewDetailCV);
  const { companyAuthor } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setViewDetailCV({ show: false }));
  };

  const onCheck = async (status) => {
    try {
      await notificationApi.updateNotification({
        userId: data?.user?._id,
        companyName: companyAuthor?.name,
        jobTitle: data?.job?.jobTitle,
        status,
      });
      await jobApi.updateStatusCV(data._id, { status });
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating CV status:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="detail-cv-modal">
      <Box sx={modalStyle}>
        <Box sx={{ position: "relative" }}>
          {data?.status && (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color:
                  data.status === "appropriate" ? "success.main" : "error.main",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {data.status}
            </Typography>
          )}
          <Typography
            id="detail-cv-modal"
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            {data?.job?.jobTitle}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
            <Typography>
              Tên ứng viên: <b>{data?.user?.name}</b>
            </Typography>
            <Typography>
              Số điện thoại: <b>{data?.user?.phone}</b>
            </Typography>
            <Typography>
              Email: <b>{data?.user?.email}</b>
            </Typography>
            <Typography>
              Địa chỉ: <b>{address(data?.user?.address)}</b>
            </Typography>
          </Box>

          <Divider>
            <Chip label="Nội dung ứng tuyển" size="small" color="primary" />
          </Divider>
          <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2 }}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {data?.textMore || "Không có nội dung bổ sung"}
            </Typography>
          </Box>

          <Divider />
          <Typography>
            Ngày ứng tuyển:{" "}
            <b>{moment(data?.createdAt).format("DD/MM/YYYY HH:mm")}</b>
          </Typography>
          <Typography>
            CV:{" "}
            <a
              href={data?.file?.file}
              download={data?.file?.newName || data?.file?.name}
              style={downloadLinkStyle}
            >
              {data?.file?.name}
            </a>
          </Typography>
        </Box>

        {!data?.status && (
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => onCheck("inappropriate")}
            >
              Chưa phù hợp
            </Button>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => onCheck("appropriate")}
            >
              Phù hợp
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DetailCVmodal;
