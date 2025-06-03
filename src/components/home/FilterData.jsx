import { Box, LinearProgress, Typography } from "@mui/material";
import JobItem from "../JobItem";
import JobDetails from "../JobDetails";

const FilterData = ({ jobs }) => {
  const isLoading = false;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#ECECEC",
        display: "flex",
        justifyContent: "center",
        gap: 3,
        padding: 2,
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Typography fontSize={23} fontWeight={600} paddingY={1}>
          {jobs?.length} công việc phù hợp
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "auto",
          }}
        >
          {isLoading ? (
            <LinearProgress />
          ) : (
            jobs?.map((job) => <JobItem key={job._id} {...job} />)
          )}
        </Box>
      </Box>
      <Box sx={{ width: "40%", margin: 1, overflow: "auto" }}>
        <JobDetails />
      </Box>
    </Box>
  );
};

export default FilterData;
