import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import FileBase64 from "react-file-base64";
import { LoadingButton } from "@mui/lab";

import { setModal } from "../slice/userSlice";
import UserAddress from "./UserAddress";
import { userApi } from "../utils/api/userApi";
import { setUser as setUserState } from "../slice/userSlice";
import { address } from "../actions/userAddress";
import { getGeocoding } from "../actions/getGeocoding";

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

const ProfileModal = () => {
  const userData = useSelector((state) => state.user.user);
  let open = useSelector((state) => state.user.modal.show);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(userData);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [gender, setGender] = useState(user?.gender);

  if (!userData) return navigate("/");

  const handleClose = () => {
    dispatch(setModal({ show: false, data: null }));
  };

  const handleChangeGender = () => {
    if (user?.sex === "male") {
      setGender("female");
    } else {
      setGender("male");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let latLon = {
      lat: null,
      lng: null,
    };
    const formData = new FormData(e.target);
    if (user.address)
      await getGeocoding(address(user.address)).then((res) => {
        latLon.lat = res?.lat;
        latLon.lng = res?.lon;
      });

    const data = {
      _id: user._id,
      username: user.username,
      name: formData.get("name") || user.name,
      email: formData.get("email") || user.email,
      phone: formData.get("phone") || user.phone,
      address: { ...user.address, ...latLon },
      birthday: formData.get("birthday") || user.birthday,
      description: formData.get("description") || user.description,
      social: formData.get("social") || user.social,
      avatar: avatar || user?.avatar,
      gender: gender || user?.gender,
    };

    try {
      const rs = await toast.promise(userApi.updateUserById(data), {
        loading: "Đang lưu...",
        success: "Lưu thành công",
        error: "Lưu thất bại",
      });
      dispatch(setUserState(rs));
      localStorage.setItem("userData", JSON.stringify(rs));
      handleClose();
    } catch (error) {
      toast.error("Lưu thất bại");
    }
  };

  const handleChangeAvatar = (e) => {
    // max 2mb
    if (e.file.size > 2000000) {
      toast.error("File quá lớn, sử dụng file < 2MB");
      return;
    }
    if (
      e.type == "image/png" ||
      e.type == "image/jpeg" ||
      e.type == "image/jpg" ||
      e.type == "image/webp"
    )
      return setAvatar(e.base64);
    else return toast.error("Ảnh không hợp lệ");
  };

  const formattedBirthday = user
    ? moment(user.birthday).format("YYYY-MM-DD")
    : "";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component={"form"} onSubmit={handleSubmit}>
        <Typography fontSize={25} fontWeight={600}>
          Thông tin cá nhân
        </Typography>
        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={avatar}
            alt="avt-user"
            sx={{ width: 100, height: 100 }}
          />
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {/* <Button
                variant="text"
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <CameraAltIcon color="red" />
                <Typography color={"red"} fontWeight={600}>
                  Chỉnh sửa
                </Typography>
              </Button> */}
            <FileBase64 onDone={handleChangeAvatar} accept="image/*" />
            {/* <Button
                variant="text"
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <DeleteIcon />
                <Typography fontWeight={600}>Xóa</Typography>
              </Button> */}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Họ và tên"
            required
            defaultValue={user.name}
            name="name"
            fullWidth
          />
          <TextField
            label="Địa chỉ email"
            required
            name="email"
            type="email"
            defaultValue={user?.email}
            sx={{ width: "45%" }}
          />
          <TextField
            label="Số điện thoại"
            required
            name="phone"
            defaultValue={user?.phone}
            sx={{ width: "45%" }}
          />
          <TextField
            label="Ngày sinh"
            required
            name="birthday"
            type="date"
            defaultValue={formattedBirthday}
            sx={{ width: "45%" }}
          />
          <FormControl sx={{ width: "45%" }}>
            <InputLabel>Giới tính</InputLabel>
            <Select
              defaultValue={gender}
              label="Giới tính"
              onChange={handleChangeGender}
            >
              <MenuItem value={"male"}>Nam</MenuItem>
              <MenuItem value={"female"}>Nữ</MenuItem>
              <MenuItem value={"other"}>Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Link cá nhân"
            required
            name="social"
            defaultValue={user?.social}
            fullWidth
          />
        </Box>

        {/* user address */}
        <UserAddress user={user} setUser={setUser} />

        <Box>
          <Typography fontWeight={600}>Giới thiệu bản thân</Typography>
          <Divider />
          <TextField
            multiline
            rows={2}
            name="description"
            defaultValue={user?.description}
            fullWidth
          />
        </Box>

        <LoadingButton
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          type="submit"
          color="error"
        >
          Cập nhật
        </LoadingButton>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
