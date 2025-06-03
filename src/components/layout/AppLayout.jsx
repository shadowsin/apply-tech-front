import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { setUser } from "../../slice/userSlice";
import { authApi } from "../../utils/api/authApi";
import { notificationApi } from "../../utils/api/notificationApi";
import { setNotifications } from "../../slice/notification";
import { companyApi } from "../../utils/api/companyApi";
import { setCompanyAuthor } from "../../slice/companySlice";

const AppLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const user = JSON.parse(localStorage.getItem("userData"));

      try {
        const result = user ? { user } : await authApi.checkAuth();
        if (result?.user) {
          const notifications = await notificationApi.getNotifications();
          const companyByAuth = await companyApi.getCompanyByAuth();
          dispatch(setCompanyAuthor(companyByAuth));
          notifications && dispatch(setNotifications(notifications));
          dispatch(setUser(result.user));
          setUser(result.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setIsLoading(false);
    checkUser();
  }, [dispatch]);
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
      <Box pt={8}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
