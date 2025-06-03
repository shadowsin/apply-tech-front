import {
  Box,
  CircularProgress,
  SpeedDial,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { setCreateModal } from "../../slice/jobSlice";
import JobModal from "../../components/JobModal";
import JobItem from "../../components/JobItem";
import DetailCVmodal from "../../components/DetailCVmodal";
import JobAppliedModal from "../../components/JobAppliedModal";

const Popup = () => {
  const dispatch = useDispatch();

  const handleCreateJob = () => {
    dispatch(setCreateModal({ show: true }));
  };

  return (
    <SpeedDial
      onClick={handleCreateJob}
      ariaLabel="Create new job"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        "& .MuiSpeedDial-fab": {
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" },
        },
      }}
      icon={<SpeedDialIcon />}
    />
  );
};

const Jobs = () => {
  const jobs = useSelector((state) => state.job.jobs);
  const isLoading = false;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {jobs?.length ? (
            jobs.map((job) => <JobItem key={job._id} {...job} />)
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                textAlign: "center",
                width: "100%",
                mt: 4,
              }}
            >
              Chưa có công việc nào
            </Typography>
          )}
        </Box>
      )}

      <Popup />
      <JobAppliedModal />
      <DetailCVmodal />
      <JobModal />
    </Box>
  );
};

export default Jobs;
