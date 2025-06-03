import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { setFaqCreateModal } from "../slice/faqSlice";
import { Button, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { faqApi } from "../utils/api/faqApi";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  minWidth: 500,
  p: 4,
  borderRadius: 5,
};

const FaqModel = () => {
  const { createModal } = useSelector((state) => state.faq);
  const [data, setdata] = useState({
    question: "",
    answer: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (createModal.data) {
      setdata({
        question: createModal.data.question,
        answer: createModal.data.answer,
        _id: createModal.data._id,
      });
    }
  }, [createModal.data]);

  const handleClose = () => {
    setdata({
      question: "",
      answer: "",
    });
    dispatch(
      setFaqCreateModal({
        open: false,
        data: null,
      })
    );
  };

  const handleCreate = async () => {
    if (!data.question || !data.question) return;
    try {
      await toast.promise(faqApi.create(data), {
        loading: "Đang thêm câu hỏi...",
        success: "Thêm câu hỏi thành công",
        error: "Thêm câu hỏi thất bại",
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    if (!data.question || !data.question) return;
    try {
      await toast.promise(faqApi.update(data), {
        loading: "Đang cập nhật câu hỏi...",
        success: "Cập nhật câu hỏi thành công",
        error: "Cập nhật câu hỏi thất bại",
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!data._id) return;
    try {
      await toast.promise(faqApi.delete(data._id), {
        loading: "Đang xóa câu hỏi...",
        success: "Xóa câu hỏi thành công",
        error: "Xóa câu hỏi thất bại",
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={createModal.open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {createModal.data ? "Update" : "Tạo"} FAQ
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", py: 2, gap: 2 }}>
          <TextField
            value={data.question}
            label="Câu hỏi"
            required
            onChange={(e) =>
              setdata((prev) => ({
                ...prev,
                question: e.target.value,
              }))
            }
          />
          <TextField
            label="Câu trả lời"
            required
            value={data.answer}
            multiline={true}
            onChange={(e) =>
              setdata((prev) => ({
                ...prev,
                answer: e.target.value,
              }))
            }
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={createModal.data ? handleUpdate : handleCreate}
          >
            {createModal.data ? "Update" : "Create"}
          </Button>
        </Box>
        {createModal.data ? (
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleDelete}
          >
            Delete
          </Button>
        ) : null}
      </Box>
    </Modal>
  );
};

export default FaqModel;
