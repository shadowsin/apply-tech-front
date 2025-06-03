import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { notificationModal } from "../slice/jobSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  minWidth: 500,
  borderRadius: 5,
};

const NotificationModal = () => {
  const dispatch = useDispatch();

  const open = useSelector((state) => state.job.notificationModal.show);
  const data = useSelector((state) => state.job.notificationModal.data);

  const handleClose = () => {
    dispatch(notificationModal({ show: false, data: null }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <img
            alt="success"
            style={{ width: 200, margin: "0 auto" }}
            src={
              "https://img.freepik.com/free-photo/rag-doll-walking-word-success_1156-189.jpg?size=626&ext=jpg&ga=GA1.1.1174626630.1700229880&semt=ais"
            }
          />
          <Typography fontWeight={600} fontSize={25} align="center">
            Tuyệt vời! CV của bạn đã được ghi nhận
          </Typography>
          <ul style={{ fontSize: 20 }}>
            Chúng tôi đã nhận được CV của bạn cho:
            <li>
              Vị trí: <b>{data?.jobTitle}</b>
            </li>
            <li>
              Công ty: <b>{data?.company?.name}</b>
            </li>
          </ul>

          <Typography fontSize={18}>
            CV của bạn sẽ được gửi tới nhà tuyển dụng sau khi được ApplyTech xét
            duyệt.
          </Typography>
          <Typography fontSize={18} color={"red"}>
            Vui lòng theo dõi qua thông báo và gmail đã đăng ký để cập nhật
            thông tun về tình trạng CV.
          </Typography>
        </Box>

        <Button
          sx={{ fontWeight: 600, mt: 3 }}
          variant="contained"
          color="error"
          fullWidth
          onClick={handleClose}
        >
          Trở về
        </Button>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
