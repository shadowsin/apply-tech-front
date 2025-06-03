import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { setSkillModal } from "../slice/userSlice";
import { userApi } from "../utils/api/userApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function SkillModal({ skills, setSkills }) {
  const dispatch = useDispatch();

  const skillModal = useSelector((state) => state.user.skillModal);
  const open = skillModal.show;

  const [newSkill, setNewSkill] = useState("");

  const handleClose = () => {
    dispatch(setSkillModal({ show: false, data: null }));
  };

  const handleAddSkill = () => {
    if (!newSkill) return;
    if (skills?.includes(newSkill)) return;
    setSkills((prev) => [...prev, newSkill.toLocaleUpperCase()]);
    setNewSkill("");
  };

  const onRemove = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      await toast.promise(userApi.updateSkills(skills), {
        loading: "Đang cập nhật",
        success: "Cập nhật thành công",
        error: "Cập nhật thất bại",
      });
      handleClose();
    } catch (error) {
      setSkills([]);
      console.log(error);
    }
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
          <Typography align="center" variant="h6" component="h2">
            Thêm mới kỹ năng
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {skills &&
              skills?.map((skill, index) => (
                <Button
                  key={index}
                  sx={{
                    px: 1,
                    pt: 0.3,
                    borderRadius: 20,
                    width: "max-content",
                    border: "1px solid gray",
                    fontWeight: 600,
                    color: "gray",
                  }}
                  endIcon={<CloseIcon color="error" />}
                  onClick={() => onRemove(index)}
                >
                  {skill}
                </Button>
              ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <TextField
              variant="standard"
              placeholder="Tên kỹ năng"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill}>Thêm</Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: 3,
              gap: 5,
            }}
          >
            <Button
              color="warning"
              variant="outlined"
              fullWidth
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              fullWidth
              color="success"
              variant="contained"
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
