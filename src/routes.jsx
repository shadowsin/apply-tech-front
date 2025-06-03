import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import AdminLayout from "./components/layout/AdminLayout";
import Users from "./pages/admin/Users";
import Jobs from "./pages/admin/Jobs";
import Company from "./pages/admin/Company";
import CompanyPage from "./pages/Company";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import AdminFAQ from "./pages/admin/FAQ";
import Custom from "./pages/admin/Custom";
import SendEmail from "./pages/Company/SendEmail";
import JobsApplied from "./pages/JobsApplied";
import Search from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/:id",
        element: <Home />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/cau-hoi-thuong-gap",
        element: <FAQ />,
      },
      {
        path: "/huong-dan-su-dung",
        element: <Support />,
      },
      {
        path: "/company/:id",
        element: <CompanyPage />,
      },
      {
        path: "/company/:id/send-email",
        element: <SendEmail />,
      },
      {
        path: "/dang-nhap",
        element: <Login />,
      },
      {
        path: "/dang-ky",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/tai-khoan",
        element: <Profile />,
      },
      {
        path: "/da-ung-tuyen",
        element: <JobsApplied />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/jobs",
        element: <Jobs />,
      },
      {
        path: "/admin/company",
        element: <Company />,
      },
      {
        path: "/admin/faq",
        element: <AdminFAQ />,
      },
      {
        path: "/admin/customer",
        element: <Custom />,
      },
    ],
  },
]);
