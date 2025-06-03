import { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Container,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { userApi } from "../utils/api/userApi";

const JobsApplied = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getJobsApplied = async () => {
      try {
        const data = await userApi.getJobsApplied();
        setJobs(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getJobsApplied();
  }, []);

  return isLoading ? (
    <LinearProgress color="error" />
  ) : (
    <Box sx={{ height: "80vh" }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {jobs.length &&
          jobs.map((item) => (
            <Paper
              key={item._id}
              sx={{
                background: "white",
                width: 450,
                height: "auto",
                padding: 1,
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                gap: 2,
              }}
            >
              <Typography
                color={"gray"}
                align="end"
                fontSize={13}
                fontStyle={"italic"}
              >
                {moment(item.createtAt).format("lll")}
              </Typography>
              <Typography color={"black"} fontWeight={600}>
                {item.job.jobTitle}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  backgroundColor: "#ddd",
                  borderRadius: 2,
                }}
              >
                <Typography
                  color={"gray"}
                  fontWeight={600}
                  fontStyle={"italic"}
                >
                  Xem hồ sơ đã ứng tuyển
                </Typography>
                <a
                  style={{
                    cursor: "pointer",
                  }}
                  href={item.file?.file}
                  download={item.file?.newName || item.file?.name}
                >
                  {item.file?.name}
                </a>
              </Box>

              {item.viewed ? (
                <Typography color={"red"} fontWeight={600} fontStyle={"italic"}>
                  Nhà tuyển dụng đã xem hồ sơ
                </Typography>
              ) : null}
            </Paper>
          ))}
      </Container>
    </Box>
  );
};

export default JobsApplied;
