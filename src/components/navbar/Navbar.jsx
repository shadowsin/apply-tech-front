import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { setUser } from "../../slice/userSlice";
import { permissionAccess } from "../../resources/data";
import { setNotifications } from "../../slice/notification";
import toast from "react-hot-toast";
import { notificationApi } from "../../utils/api/notificationApi";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNoti, setShowNoti] = useState(false);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { notifications: noti } = useSelector((state) => state.notification);

  const notifications = noti?.notifications || [];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const viewProfile = () => {
    navigate("/tai-khoan");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUser(null));
    dispatch(setNotifications([]));
    window.location.href = "/";
  };

  const handleCheckAll = async () => {
    try {
      await toast.promise(notificationApi.checkAll(), {
        loading: "Đang xử lý...",
        success: ({ message }) => message,
        error: "Xử lý thất bại",
      });
      setShowNoti(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  console.log({user})

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        bgcolor: "grey.900",
        background: "linear-gradient(to right, #000000, #b71c1c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
      }}
    >
      <Typography
        component="a"
        href="/"
        sx={{
          color: "white",
          fontSize: { xs: 24, sm: 28 },
          fontWeight: 700,
          fontFamily: "'Lilita One', sans-serif",
          textDecoration: "none",
          "&:hover": { color: "grey.200" },
        }}
      >
        ApplyTech
      </Typography>

      {user ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography
              onClick={handleClick}
              sx={{
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                maxWidth: 150,
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": { color: "grey.200" },
              }}
            >
              {user?.name || user?.username}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "user-menu" }}
              PaperProps={{
                sx: { minWidth: 200, borderRadius: 2, boxShadow: 3 },
              }}
            >
              {permissionAccess.includes(user?.role) && (
                <MenuItem
                  onClick={() => {
                    navigate("admin/jobs");
                    handleClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  Dashboard
                </MenuItem>
              )}
              <MenuItem onClick={viewProfile} sx={{ py: 1.5 }}>
                Tài khoản
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/da-ung-tuyen");
                  handleClose();
                }}
                sx={{ py: 1.5 }}
              >
                Hồ sơ đã ứng tuyển
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>

          <IconButton
            onClick={() => setShowNoti(!showNoti)}
            aria-label="notifications"
          >
            <Badge
              badgeContent={
                notifications?.filter?.((n) => !n.viewed)?.length || 0
              }
              color="error"
            >
              <NotificationsIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>
        </Box>
      ) : (
        <Typography
          onClick={() => navigate("/dang-nhap")}
          sx={{
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { color: "grey.200" },
          }}
        >
          Đăng nhập
        </Typography>
      )}

      {showNoti && (
        <Box
          sx={{
            position: "absolute",
            top: 64,
            right: 16,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
            width: { xs: "90vw", sm: 400 },
            maxHeight: 500,
            overflowY: "auto",
            p: 2,
            zIndex: 50,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Thông báo
            </Typography>
            {notifications?.length > 0 && (
              <Typography
                onClick={handleCheckAll}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Đánh dấu đã đọc
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          {notifications?.length > 0 ? (
            notifications.map((data) => (
              <Box
                key={data._id}
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: data.viewed ? "grey.50" : "primary.50",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">{data.title}</Typography>
                  <Typography variant="body2">
                    {moment(data.createdAt).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {data.companyName}
                </Typography>
                {data.jobTitle && (
                  <Typography variant="body2" fontStyle="italic">
                    Cảm ơn bạn đã ứng tuyển vị trí {data.jobTitle}
                  </Typography>
                )}
                <Typography variant="body2">
                  Chúng tôi đã gửi CV đến doanh nghiệp
                </Typography>
                <Typography variant="caption" color="error.main">
                  Vui lòng chờ phản hồi từ doanh nghiệp qua email
                </Typography>
              </Box>
            ))
          ) : (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ py: 2 }}
            >
              Không có thông báo
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
