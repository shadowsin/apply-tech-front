import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";

import { authApi } from "../../utils/api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errText, setErrText] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    let err = false;
    setErrText({ username: "", email: "", password: "", confirmPassword: "" });

    if (data.username.length < 6) {
      setErrText((prev) => ({
        ...prev,
        username: "Tên đăng nhập phải có ít nhất 6 ký tự",
      }));
      err = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrText((prev) => ({
        ...prev,
        email: "Email không hợp lệ",
      }));
      err = true;
    }
    if (data.password.length < 6) {
      setErrText((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 6 ký tự",
      }));
      err = true;
    }
    if (data.password !== data.confirmPassword) {
      setErrText((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      }));
      err = true;
    }

    if (err) {
      setIsLoading(false);
      return;
    }

    try {
      await toast.promise(authApi.signup(data), {
        loading: "Đang đăng ký...",
        success: "Đăng ký thành công!",
        error: (err) => err.response?.data?.message || "Đăng ký thất bại",
      });
      navigate("/dang-nhap");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        bgcolor: "grey.50",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 3,
          p: 4,
          width: { xs: "90%", sm: 400, md: 450 },
          maxWidth: 450,
          gap: 3,
          boxShadow: 3,
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          align="center"
          color="primary.main"
        >
          Đăng ký
        </Typography>

        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          name="username"
          required
          error={!!errText.username}
          helperText={errText.username}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          required
          error={!!errText.email}
          helperText={errText.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          type={showPass ? "text" : "password"}
          name="password"
          required
          error={!!errText.password}
          helperText={errText.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPass(!showPass)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Xác nhận mật khẩu"
          variant="outlined"
          type={showConfirmPass ? "text" : "password"}
          name="confirmPassword"
          required
          error={!!errText.confirmPassword}
          helperText={errText.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  edge="end"
                  aria-label="toggle confirm password visibility"
                >
                  {showConfirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={!isDisable}
              onChange={() => setIsDisable(!isDisable)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              Tôi đồng ý với{" "}
              <Link
                to="/dieu-khoan"
                style={{ color: "primary.main", textDecoration: "none" }}
              >
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link
                to="/chinh-sach"
                style={{ color: "primary.main", textDecoration: "none" }}
              >
                Chính sách riêng tư
              </Link>{" "}
              của ApplyTech.
            </Typography>
          }
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
        />

        <LoadingButton
          disabled={isDisable}
          fullWidth
          variant="contained"
          type="submit"
          loading={isLoading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            bgcolor: "primary.dark",
            "&:hover": { bgcolor: "primary.darker" },
          }}
        >
          Đăng ký
        </LoadingButton>

        <Typography align="center">
          Đã có tài khoản?{" "}
          <Link
            to="/dang-nhap"
            style={{
              color: "primary.main",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng nhập ngay
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
