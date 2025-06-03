import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setAppliedModal, setViewDetailCV } from "../slice/jobSlice";
import { jobApi } from "../utils/api/jobApi";
import { notificationApi } from "../utils/api/notificationApi";

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

const paperStyle = {
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  transition: "all 0.2s",
  "&:hover": {
    bgcolor: "grey.50",
    transform: "translateY(-2px)",
  },
};

const downloadLinkStyle = {
  color: "primary.main",
  textDecoration: "none",
  fontWeight: 500,
  "&:hover": {
    textDecoration: "underline",
  },
};

const JobAppliedModal = () => {
  const dispatch = useDispatch();
  const { open, data } = useSelector((state) => state.job.appliedModal);
  const { companyAuthor } = useSelector((state) => state.company);

  const handleClose = () => {
    dispatch(setAppliedModal({ show: false }));
  };

  const handleViewDetail = async (item) => {
    try {
      if (!item?.viewed) {
        await notificationApi.updateNotification({
          userId: item?.user?._id,
          companyName: companyAuthor?.name,
          jobTitle: item?.job?.jobTitle,
          viewed: true,
        });
      }
      await jobApi.updateViewCV(item._id);
      dispatch(setViewDetailCV({ open: true, data: item }));
      handleClose();
    } catch (error) {
      console.error("Error viewing CV details:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="job-applied-modal"
    >
      <Box sx={modalStyle}>
        <Typography
          id="job-applied-modal"
          variant="h6"
          align="center"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Tổng cộng {data?.length || 0} CV đã ứng tuyển
        </Typography>
        {data?.length > 0 ? (
          data.map((item, index) => (
            <Paper key={index} elevation={3} sx={paperStyle}>
              <Typography variant="body2" color="text.secondary">
                Ngày ứng tuyển:{" "}
                {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <a
                href={item?.file?.file}
                download={item?.file?.newName || item?.file?.name}
                style={downloadLinkStyle}
              >
                {item?.file?.name}
              </a>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1, alignSelf: "flex-start" }}
                onClick={() => handleViewDetail(item)}
              >
                Xem chi tiết
              </Button>
            </Paper>
          ))
        ) : (
          <Typography align="center" color="text.secondary">
            Chưa có CV nào được ứng tuyển
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default JobAppliedModal;
