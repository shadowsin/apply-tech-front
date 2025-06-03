import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
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
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { setUser } from "../../slice/userSlice";
import { authApi } from "../../utils/api/authApi";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const result = await toast.promise(authApi.login(data), {
        loading: "Đang đăng nhập...",
        success: "Đăng nhập thành công!",
        error: (err) => err.response?.data?.message || "Đăng nhập thất bại",
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("userData", JSON.stringify(result.user));
      dispatch(setUser(result.user));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
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
          Đăng nhập
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          type={showPass ? "text" : "password"}
          name="password"
          required
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
                color="primary"
              />
            }
            label="Ghi nhớ đăng nhập"
            sx={{ flex: "1 1 auto" }}
          />
          <Typography
            component={Link}
            to="/quen-mat-khau"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <LoadingButton
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
          Đăng nhập
        </LoadingButton>

        <Typography align="center">
          Chưa có tài khoản?{" "}
          <Link
            to="/dang-ky"
            style={{
              color: "primary.main",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng ký ngay
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
