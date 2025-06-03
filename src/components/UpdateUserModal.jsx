import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import moment from "moment";

import { setModal } from "../slice/userSlice";
import UserAddress from "./UserAddress";
import { userApi } from "../utils/api/userApi";
import { address } from "../actions/userAddress";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  minWidth: { xs: "90%", sm: 500 },
  maxWidth: 600,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const UpdateUserModal = () => {
  const dispatch = useDispatch();
  const { show: open, data: userData } = useSelector(
    (state) => state.user.modal
  );

  const [user, setUser] = useState(userData);
  const [avatar, setAvatar] = useState(userData?.avatar || null);
  const [gender, setGender] = useState(userData?.gender || "male");
  const [role, setRole] = useState(userData?.role || "user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUser(userData);
    setAvatar(userData?.avatar || null);
    setGender(userData?.gender || "male");
    setRole(userData?.role || "user");
  }, [userData]);

  const handleClose = () => {
    dispatch(setModal({ show: false, data: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = {
      _id: user._id,
      username: user?.username,
      name: formData.get("name") || user?.name,
      email: formData.get("email") || user?.email,
      phone: formData.get("phone") || user?.phone,
      address: user?.address,
      birthday: formData.get("birthday") || user?.birthday,
      description: formData.get("description") || user?.description,
      social: formData.get("social") || user?.social,
      avatar: avatar || user?.avatar,
      gender: gender || user?.gender,
      role: role || user?.role,
    };

    try {
      await toast.promise(userApi.updateUserById(data), {
        loading: "Đang cập nhật...",
        success: "Cập nhật thành công!",
        error: "Cập nhật thất bại",
      });
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeAvatar = (e) => {
    if (!e.type.includes("image")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ (PNG, JPG)");
      return;
    }
    // max 2mb
    if (e.size > 2000000) {
      toast.error("File quá lớn");
      return;
    }
    setAvatar(e.base64);
  };

  const formattedBirthday = user
    ? moment(user.birthday).format("YYYY-MM-DD")
    : "";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-user-modal-title"
    >
      <Box sx={modalStyle}>
        {user ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography
              id="update-user-modal-title"
              variant="h6"
              fontWeight={600}
              align="center"
            >
              Cập nhật thông tin người dùng
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={avatar || user?.avatar}
                alt={user?.name}
                sx={{
                  width: 120,
                  height: 120,
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              />
              <FileBase64
                multiple={false}
                onDone={handleChangeAvatar}
                style={{
                  padding: 8,
                  border: "2px dashed",
                  borderColor: "primary.main",
                  borderRadius: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "primary.50",
                  width: "100%",
                  maxWidth: 200,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Tên"
                name="name"
                defaultValue={user?.name}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                defaultValue={user?.email}
                sx={{ width: { xs: "100%", sm: "48%" } }}
                required
                margin="normal"
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                defaultValue={user?.phone}
                sx={{ width: { xs: "100%", sm: "48%" } }}
                required
                margin="normal"
              />
              <TextField
                label="Ngày sinh"
                name="birthday"
                type="date"
                defaultValue={formattedBirthday}
                sx={{ width: { xs: "100%", sm: "48%" } }}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl sx={{ width: { xs: "100%", sm: "48%" }, mt: 2 }}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={gender}
                  label="Giới tính"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Link cá nhân"
                name="social"
                defaultValue={user?.social}
                fullWidth
                required
                margin="normal"
              />
            </Box>

            <Paper elevation={3} sx={{ p: 2, my: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Địa chỉ hiện tại: <b>{address(user?.address) || "-"}</b>
              </Typography>
              <UserAddress user={user} setUser={setUser} />
            </Paper>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Giới thiệu
              </Typography>
              <Divider sx={{ my: 1 }} />
              <TextField
                name="description"
                defaultValue={user?.description}
                multiline
                rows={3}
                fullWidth
                placeholder="Mô tả ngắn về bản thân..."
              />
            </Box>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Quyền hạn</InputLabel>
              <Select
                value={role}
                label="Quyền hạn"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <LoadingButton
              fullWidth
              variant="contained"
              type="submit"
              loading={isSubmitting}
              sx={{ mt: 2, py: 1.5, textTransform: "none" }}
            >
              Cập nhật
            </LoadingButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default UpdateUserModal;
