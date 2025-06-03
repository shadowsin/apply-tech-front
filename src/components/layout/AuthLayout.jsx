import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, LinearProgress } from "@mui/material";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { setUser } from "../../slice/userSlice";
import { authApi } from "../../utils/api/authApi";
import { notificationApi } from "../../utils/api/notificationApi";
import { setNotifications } from "../../slice/notification";

const AuthLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = JSON.parse(localStorage.getItem("userData"));

      try {
        const result = user ? { user } : await authApi.checkAuth();
        if (!result.user) return navigate("/");
        const notifications = await notificationApi.getNotifications();
        notifications && dispatch(setNotifications(notifications));
        dispatch(setUser(result.user));
        setIsLoading(false);
      } catch (error) {
        return navigate("/");
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Box
      sx={{
        background: `linear-gradient(to right, black, #540509)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box pt={10}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AuthLayout;
