import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Box,
  Button,
  Typography,
  Modal,
} from "@mui/material";
import FileBase64 from "react-file-base64";
import toast from "react-hot-toast";

import { notificationModal, setJobApplied, showModal } from "../slice/jobSlice";
import { notificationApi } from "../utils/api/notificationApi";
import { userApi } from "../utils/api/userApi";

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

const ApplyModal = () => {
  const dispatch = useDispatch();
  const [textMore, setTextMore] = useState("");
  const [nameOfUser, setNameOfUser] = useState("");
  const [options, setOptions] = useState("Sử dụng CV đã UpLoad");
  const [cvApplied, setCvApplied] = useState(null);
  const [file, setFile] = useState({
    file: "",
    name: "",
  });

  const open = useSelector((state) => state.job.modal.show);
  const data = useSelector((state) => state.job.modal.data);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      const cvApplied = await userApi.getCVapplied(user._id);
      setCvApplied(cvApplied.user.file);
    };
    user?._id && fetchData();
    setNameOfUser(user?.name);
  }, [user]);

  const handleClose = () => {
    dispatch(showModal({ show: false, data: null }));
  };

  const onGetFileDone = (e) => {
    if (!e.type?.includes("document") && !e.type?.includes("pdf"))
      return toast.error("File không hợp lệ");
    if (e.size > 5000) return toast.error("File quá lớn");
    setFile({ file: e.base64, name: e.name });
  };

  const handleApply = async () => {
    const dataApply = {
      uid: user._id,
      nameOfUser,
      jobId: data._id,
      textMore,
      file,
    };

    if (dataApply.nameOfUser === "") return toast.error("Bạn chưa nhập tên");

    if (options === "Sử dụng CV đã UpLoad") {
      if (cvApplied) dataApply.file = cvApplied;
    }
    if (dataApply.file.file === "") return toast.error("Chưa có CV");

    const dataNoti = {
      userId: user._id,
      companyName: data?.company?.name,
      jobTitle: data?.jobTitle,
    };

    await toast
      .promise(userApi.jobApply(dataApply), {
        loading: "Đang gửi yêu cầu",
        success: "Gửi yêu cầu thành công",
        error: "Gửi yêu cầu thất bại",
      })
      .then(() => {
        notificationApi.updateNotification(dataNoti);
        handleClose();
        dispatch(notificationModal({ show: true, data }));
        dispatch(setJobApplied({ job: data, userId: user._id }));
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography fontWeight={600} fontSize={20}>
              {data?.company?.name}
            </Typography>
            <TextField
              label={"Tên"}
              required
              fullWidth
              value={nameOfUser}
              onChange={(e) => setNameOfUser(e.target.value)}
            />
            <Typography fontWeight={600} fontSize={20}>
              CV Ứng tuyển
            </Typography>
            <FormControl>
              <RadioGroup
                defaultValue={options}
                onChange={(e) => setOptions(e.target.value)}
              >
                <Box
                  sx={{ border: "2px solid #ddd", padding: 1, borderRadius: 2 }}
                >
                  <FormControlLabel
                    value="Sử dụng CV đã UpLoad"
                    control={<Radio />}
                    disabled={!cvApplied?.data?.user?.file}
                    label={`Sử dụng  ${
                      (cvApplied && cvApplied.name) || ""
                    } CV đã upload`}
                  />
                  <Typography color={"error"} sx={{ ml: 4 }}>
                    {cvApplied?.data?.user?.file?.name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    border: "2px solid #ddd",
                    padding: 1,
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    value="Tải lên CV mới"
                    control={<Radio />}
                    label="Tải lên CV mới"
                  />
                  <FileBase64 onDone={onGetFileDone} />
                  <Typography sx={{ ml: 4, color: "#999", fontSize: 12 }}>
                    Hỗ trợ định dạng .doc .pdf, không chứa mật khẩu bảo vệ, dung
                    lượng dưới 3mb.
                  </Typography>
                </Box>
              </RadioGroup>
            </FormControl>

            <Typography fontSize={20} fontWeight={600}>
              Thư xin thực tập{" "}
              <span style={{ fontWeight: 300, color: "#999" }}>
                (Không bắt buộc)
              </span>
            </Typography>

            <Typography>
              Những kỹ năng, dự án hay thành tựu nào chứng tỏ bạn là một ứng
              viên tiềm năng cho vị trí ứng tuyển này?
            </Typography>

            <TextField
              onChange={(e) => setTextMore(e.target.value)}
              value={textMore}
              multiline
              rows={3}
              placeholder="Nêu nhiều vị trí cụ thể để làm hồ sơ ứng tuyển của bạn thuyết phục hơn..."
            />
            <Typography color={"#999"}>
              Còn lại {500 - textMore.length} trong tổng 500 kí tự
            </Typography>
          </Box>

          <Button
            sx={{ fontWeight: 600, mt: 3 }}
            variant="contained"
            color="error"
            fullWidth
            onClick={handleApply}
          >
            Gửi CV của tôi
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ApplyModal;
