import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import SocialDistanceIcon from "@mui/icons-material/SocialDistance";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import EmailIcon from "@mui/icons-material/Email";

import JobItem from "../../components/JobItem";
import { address } from "../../actions/userAddress";
import { companyApi } from "../../utils/api/companyApi";
import Comment from "../../components/Comment";
import { commentApi } from "../../utils/api/commentApi";
import { getGeocoding } from "../../actions/getGeocoding";
import { getDistance } from "../../actions/getDistance";

const Company = () => {
  const param = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobsOfCompany, setJobsOfCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [geo1, setGeo1] = useState(null);
  const [geo2, setGeo2] = useState(null);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const getCompany = async () => {
      const [result, jobsOfCompany, comments] = await Promise.all([
        companyApi.getCompany(param?.id),
        companyApi.getCompanyJobs(param?.id),
        commentApi.getCommentByCompany(param?.id),
      ]);

      setCompany(result);
      setJobsOfCompany(jobsOfCompany);
      setIsLoading(false);
      setComments(comments);
    };
    getCompany();
  }, [param?.id]);

  useEffect(() => {
    if (!user) return;
    if (company && company.address) {
      getGeocoding(address({ ...company.address, street: null })).then((data) =>
        setGeo1([data.lat, data.lon])
      );
    }

    if (user && user.address) {
      if (user.address.lat && user.address.lng) {
        setGeo2([user.address.lat, user.address.lng]);
      } else {
        getGeocoding(address({ ...user.address, street: null })).then((data) =>
          setGeo2([data.lat, data.lon])
        );
      }
    }
  }, [company, user]);

  const distance = useMemo(() => {
    if (!geo1 || !geo2) return null;
    return getDistance(geo1, geo2);
  }, [geo1, geo2]);

  return (
    <Box minHeight={"80vh"}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Box>
          <Divider sx={{ color: "white" }} />
          <Box sx={{ display: "flex", gap: 3, px: 10 }}>
            <img
              src={company?.image}
              style={{
                borderRadius: 5,
                width: 200,
                height: 200,
                objectFit: "cover",
              }}
              alt="logo-company"
            />
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Typography fontWeight={600} color={"white"} fontSize={30}>
                {company?.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <LocationOnIcon sx={{ color: "white" }} />
                  <Typography fontWeight={600} color={"white"} fontSize={20}>
                    {address(company?.address)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <BookmarksIcon sx={{ color: "white" }} />
                  <Typography fontWeight={600} color={"white"} fontSize={20}>
                    {jobsOfCompany?.length} việc làm đang tuyển dụng
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <SocialDistanceIcon sx={{ color: "white" }} />
                <Typography
                  fontWeight={600}
                  color={"white"}
                  fontSize={20}
                  sx={{ display: "flex", flexDirection: "row", gap: 1 }}
                >
                  Khoảng cách đến công ty:{" "}
                  {distance ? (
                    distance
                  ) : (
                    <Skeleton
                      variant="text"
                      animation="pulse"
                      sx={{
                        fontSize: "1rem",
                        width: 50,
                        backgroundColor: "gray",
                      }}
                    />
                  )}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <EmailIcon sx={{ color: "white" }} />
                <Typography fontWeight={600} color={"white"} fontSize={20}>
                  Gửi email
                </Typography>
                <IconButton
                  sx={{
                    width: 50,
                    height: 50,
                    p: 2,
                    background: "rgba(165,219,146,.1)",
                    ml: 2,
                  }}
                  color="success"
                  onClick={() => navigate(`/company/${company._id}/send-email`)}
                >
                  <AttachEmailIcon color="success" />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 5,
              background: "#ddd",
              display: "flex",
              width: "100%",
              justifyContent: "center",
              px: 10,
            }}
          >
            <Box
              sx={{
                py: 3,
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Paper>
                <Typography
                  fontSize={23}
                  fontWeight={600}
                  color={"red"}
                  pl={5}
                  py={3}
                >
                  Giới thiệu
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Thông tin công ty
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography color="text.secondary">
                      Mô hình công ty
                    </Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      Sản phẩm
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography color="text.secondary">
                      Quy mô công ty
                    </Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      {company?.scale || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography color="text.secondary">Quốc gia</Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      {company?.country || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography color="text.secondary">
                      Thời gian làm việc
                    </Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      Thứ 2 - Thứ 6
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 200px" }}>
                    <Typography color="text.secondary">Giờ làm việc</Typography>
                    <Typography fontWeight={600} fontSize={18}>
                      {company?.ot || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="error.main"
                  mb={2}
                >
                  Giới thiệu công ty
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {company?.description || "Chưa có thông tin giới thiệu"}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LanguageIcon color="primary" />
                    <Typography fontWeight={600}>
                      <a
                        href={company?.website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "primary.main",
                          textDecoration: "none",
                        }}
                      >
                        Website công ty
                      </a>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FacebookIcon color="primary" />
                    <Typography fontWeight={600}>
                      <a
                        href={company?.social || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "primary.main",
                          textDecoration: "none",
                        }}
                      >
                        Fanpage Facebook
                      </a>
                    </Typography>
                  </Box>
                </Box>
              </Paper>

             

              <Comment comments={comments} company={company} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                // maxHeight: 650,
                overflow: "auto",
              }}
            >
              {jobsOfCompany?.map((job) => (
                <JobItem key={job._id} {...job} company={company} />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Company;
