import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

import logo from "../../assets/images/logo.jpg";

const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === "/search") return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        color: "white",
        p: 5,
        gap: 3,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <IconButton>
            <LinkedInIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton>
            <FacebookIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton>
            <YouTubeIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <img src={logo} alt="Logo ApplyTech" style={{ width: 120 }} />
      </Box>

      {/* Cột Giới thiệu */}
      <Box>
        <Typography fontWeight={600} gutterBottom>
          Về ApplyTech
        </Typography>
        <Typography
          sx={{ cursor: "pointer", mb: 1 }}
          onClick={() => navigate("/huong-dan-su-dung")}
        >
          Hướng dẫn sử dụng
        </Typography>
        <Typography
          sx={{ cursor: "pointer", mb: 1 }}
          onClick={() => navigate("/cau-hoi-thuong-gap")}
        >
          Câu hỏi thường gặp
        </Typography>
        <Typography
          sx={{ cursor: "pointer", mb: 1 }}
          onClick={() => navigate("/ve-chung-toi")}
        >
          Giới thiệu ApplyTech
        </Typography>
      </Box>

      {/* Cột Chính sách */}
      <Box>
        <Typography fontWeight={600} gutterBottom>
          Chính sách & Điều khoản
        </Typography>
        <Typography sx={{ cursor: "pointer", mb: 1 }}>
          Quy định bảo mật
        </Typography>
        <Typography sx={{ cursor: "pointer", mb: 1 }}>
          Thỏa thuận sử dụng
        </Typography>
        <Typography sx={{ cursor: "pointer", mb: 1 }}>
          Thông cáo báo chí
        </Typography>
      </Box>

      {/* Cột Liên hệ */}
      <Box>
        <Typography fontWeight={600} gutterBottom>
          Liên hệ
        </Typography>
        <Typography sx={{ mb: 1 }}>Email: support@applytech.vn</Typography>
        <Typography sx={{ mb: 1 }}>Hotline: 1900 9999</Typography>
        <Typography>Địa chỉ: 123 Đường ABC, Q.1, TP.HCM</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
