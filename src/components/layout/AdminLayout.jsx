import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Skeleton } from "@mui/material";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Sider from "../Sider";
import { setUser, setUsers } from "../../slice/userSlice";
import { permissionAccess } from "../../resources/data";
import { authApi } from "../../utils/api/authApi";
import { companyApi } from "../../utils/api/companyApi";
import { jobApi } from "../../utils/api/jobApi";
import { setCompanies, setCompanyAuthor } from "../../slice/companySlice";
import { setJobs } from "../../slice/jobSlice";
import { userApi } from "../../utils/api/userApi";
import { faqApi } from "../../utils/api/faqApi";
import { setFaqData } from "../../slice/faqSlice";

const AdminLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const result = await authApi.checkAuth();
        if (
          (!result &&
            result?.user &&
            !permissionAccess.includes(result.user.role)) ||
          result.error
        ) {
          return navigate("/");
        }

        const [companyAuth, jobs, companies] = await Promise.all([
          companyApi.getCompanyByAuth(),
          jobApi.getJobsByRoot(),
          companyApi.getCompanies(),
        ]);

        dispatch(setJobs(jobs));
        dispatch(setCompanyAuthor(companyAuth));
        dispatch(setUser(result.user));
        dispatch(setCompanies(companies));

        if (
          pathname.includes("/users") &&
          pathname.includes("/faq") &&
          result.user.role !== "admin"
        ) {
          return navigate("/");
        } else {
          const [faq, users] = await Promise.all([
            faqApi.gets(),
            userApi.getUsers(),
          ]);
          dispatch(setUsers(users));
          dispatch(setFaqData(faq));
        }
        setIsLoading(false);
      } catch (error) {
        return navigate("/");
      }
    };
    checkAdmin();
  }, [dispatch, navigate, pathname]);

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, black, #540509)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        sx={{
          pt: 10,
          display: "flex",
          width: "100%",
          backgroundColor: "white",
          justifyContent: "space-between",
        }}
      >
        <Box component="nav">
          {isLoading ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={300} height={60} />
              ))}
            </Box>
          ) : (
            <Sider />
          )}
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 1,
                padding: 2,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={500} height={300} />
              ))}
            </Box>
          ) : (
            <Outlet />
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
