import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

import { jobApi } from "../utils/api/jobApi";
import {
  setAppliedModal,
  setCreateModal,
  setJobSelected,
} from "../slice/jobSlice";
import { address } from "../actions/userAddress";
import { permissionAccess } from "../resources/data";

const SkillChip = ({ skill }) => (
  <Typography
    sx={{
      px: 1.5,
      py: 0.5,
      fontSize: 12,
      fontWeight: 500,
      borderRadius: 20,
      border: "1px solid",
      borderColor: "grey.300",
      bgcolor: "grey.50",
      color: "text.primary",
      "&:hover": { bgcolor: "grey.100" },
    }}
  >
    {skill}
  </Typography>
);

const JobItem = (job) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [jobApplied, setJobApplied] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const company = job?.company;

  useEffect(() => {
    if (permissionAccess.includes(user?.role)) {
      const fetchData = async () => {
        const data = await jobApi.cvApplied(job._id);
        setJobApplied(data);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [user?.role, job._id]);

  const handleDelete = async () => {
    await toast
      .promise(jobApi.deleteJob(job._id), {
        loading: "Đang xóa công việc...",
        success: "Xóa công việc thành công",
        error: "Xóa công việc thất bại",
      })
      .then(() => window.location.reload());
  };

  const handleUpdate = () => {
    dispatch(setCreateModal({ show: true, data: { job, company } }));
  };

  const handleViewJob = () => {
    navigate(`/${job._id}`);
    dispatch(setJobSelected(job));
  };

  const handleViewCompany = () => {
    navigate(`/${company._id}`, { company });
  };

  const handleViewUserApplied = () => {
    dispatch(setAppliedModal({ open: true, data: jobApplied }));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: "100%", sm: 430 },
        maxWidth: "100%",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "white",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        onClick={handleViewJob}
        sx={{
          padding: 2,
          border: pathname.includes(job?._id)
            ? "2px solid red"
            : "2px solid transparent",
          borderRadius: 3,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Company */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={company?.image}
            variant="square"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCompany();
            }}
            sx={{ width: 56, height: 56, borderRadius: 2, cursor: "pointer" }}
          />
          <Typography variant="h6" textTransform="capitalize">
            {company?.name}
          </Typography>
        </Box>

        {/* Job Title */}
        <Typography
          variant="h6"
          fontWeight={600}
          mt={2}
          textTransform="capitalize"
        >
          {job.jobTitle}
        </Typography>

        <Divider />

        {/* Job Info */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <ApartmentIcon color="primary" />
            <Typography fontWeight={500}>
              {address(job.jobLocation)?.length > 40
                ? address(job.jobLocation).slice(0, 40) + "..."
                : address(job.jobLocation)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CurrencyExchangeIcon color="warning" />
            <Typography fontWeight={500}>{job.salary}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon color="success" />
            <Typography fontWeight={500} color="text.secondary">
              {moment(job.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Skills */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: 80,
            overflowY: "auto",
          }}
        >
          {job?.jobSkills?.split(",")?.length > 0 ? (
            job?.jobSkills
              ?.split(",")
              .map((skill, index) => <SkillChip key={index} skill={skill} />)
          ) : (
            <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
              Chưa có kỹ năng
            </Typography>
          )}
        </Box>
      </Box>

      {/* Admin Actions */}
      {pathname.includes("admin") && (
        <Box p={2} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{ width: "48%" }}
            >
              Xoá
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleUpdate}
              sx={{ width: "48%" }}
            >
              Chỉnh sửa
            </Button>
          </Box>
          {isLoading ? (
            <CircularProgress sx={{ alignSelf: "center", mt: 1 }} size={24} />
          ) : (
            <Button
              variant="outlined"
              color="success"
              onClick={handleViewUserApplied}
              sx={{ borderRadius: "50px", mt: 1 }}
            >
              View {jobApplied.length} User{jobApplied.length !== 1 ? "s" : ""}{" "}
              Applied
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default JobItem;
