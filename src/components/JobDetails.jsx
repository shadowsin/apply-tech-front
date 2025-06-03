import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import SocialDistanceIcon from "@mui/icons-material/SocialDistance";

import { showModal } from "../slice/jobSlice";
import { jobApi } from "../utils/api/jobApi";
import { address } from "../actions/userAddress";
import { getGeocoding } from "../actions/getGeocoding";
import { getDistance } from "../actions/getDistance";

const Skill = ({ name }) => (
  <Typography
    sx={{
      px: 1.5,
      py: 0.5,
      borderRadius: 20,
      border: "1px solid",
      borderColor: "grey.300",
      fontWeight: 500,
      color: "text.primary",
      bgcolor: "grey.50",
      "&:hover": { bgcolor: "grey.100" },
    }}
  >
    {name}
  </Typography>
);

const JobDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { jobSelected } = useSelector((state) => state.job);

  const [jobApplied, setJobApplied] = useState([]);
  const [geo1, setGeo1] = useState(null);
  const [geo2, setGeo2] = useState(null);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (jobSelected?._id) {
        try {
          const data = await jobApi.cvApplied(jobSelected._id);
          setJobApplied(data);
        } catch (error) {
          console.error("Error fetching applied CVs:", error);
        }
      }
    };
    fetchData();
  }, [jobSelected?._id]);

  useEffect(() => {
    if (jobSelected?.company?.address) {
      getGeocoding(address({ ...jobSelected.company.address, street: "" }))
        .then((data) => setGeo1([data.lat, data.lon]))
        .catch((error) =>
          console.error("Error fetching company geocoding:", error)
        );
    }
    if (user?.address) {
      if (user.address.lat && user.address.lng) {
        setGeo2([user.address.lat, user.address.lng]);
      } else {
        getGeocoding(address({ ...user.address, street: null }))
          .then((data) => setGeo2([data.lat, data.lon]))
          .catch((error) =>
            console.error("Error fetching user geocoding:", error)
          );
      }
    }
  }, [jobSelected?.company?.address, user?.address]);

  const isApplied = useMemo(() => {
    return jobApplied.some((j) => j.user?._id === user?._id);
  }, [jobApplied, user?._id]);

  const distance = useMemo(() => {
    if (!geo1 || !geo2) return null;
    return getDistance(geo1, geo2);
  }, [geo1, geo2]);

  const handleApply = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      return;
    }
    dispatch(showModal({ show: true, data: jobSelected }));
  };

  return jobSelected ? (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "grey.300",
        p: 3,
        borderRadius: 3,
        minHeight: 500,
        bgcolor: "white",
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          onClick={() => navigate(`/company/${jobSelected.company._id}`)}
          variant="square"
          alt={jobSelected.company?.name}
          src={jobSelected.company?.image}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: "grey.100",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => navigate(`/company/${jobSelected.company._id}`)}
          >
            {jobSelected.jobTitle}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.secondary"
          >
            {jobSelected.company?.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <CurrencyExchangeIcon color="warning" />
            <Typography variant="h6" fontWeight={600}>
              {jobSelected.salary}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.5, fontSize: 16, borderRadius: 2, mt: 3 }}
        onClick={handleApply}
        disabled={isApplied}
      >
        {isApplied
          ? "Bạn đã ứng tuyển"
          : user
          ? "Ứng tuyển ngay"
          : "Đăng nhập để ứng tuyển"}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {distance && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SocialDistanceIcon color="error" sx={{ fontSize: 28 }} />
            <Typography color="error.main" fontWeight={600}>
              Khoảng cách: {distance}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ApartmentIcon color="info" sx={{ fontSize: 28 }} />
          <Typography fontWeight={600}>
            {address(jobSelected.jobLocation) || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AccessAlarmIcon color="warning" sx={{ fontSize: 28 }} />
          <Typography fontWeight={600}>
            {jobSelected.wotkingForm || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography fontWeight={600} fontSize={18} sx={{ width: 100 }}>
            Kỹ năng:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {jobSelected.jobSkills
              ?.split(",")
              .map((skill, i) => <Skill key={i} name={skill.trim()} />) || (
              <Typography color="text.secondary">Chưa có kỹ năng</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" fontWeight={600} color="primary.main" mb={2}>
            {jobSelected.company?.name}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: "1 1 200px" }}>
              <Typography color="text.secondary">Mô hình công ty</Typography>
              <Typography fontWeight={600}>Doanh nghiệp</Typography>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Typography color="text.secondary">Quy mô công ty</Typography>
              <Typography fontWeight={600}>50-150 nhân viên</Typography>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Typography color="text.secondary">Quốc gia</Typography>
              <Typography fontWeight={600}>
                {jobSelected.company?.country || "-"}
              </Typography>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Typography color="text.secondary">Thời gian làm việc</Typography>
              <Typography fontWeight={600}>Thứ 2 - Thứ 6</Typography>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Typography color="text.secondary">Làm việc ngoài giờ</Typography>
              <Typography fontWeight={600}>
                {jobSelected.company?.ot || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Thông tin chi tiết
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {showFull || jobSelected?.jobDescription?.length <= 180
              ? jobSelected?.jobDescription
              : `${jobSelected?.jobDescription?.slice(0, 180)}...`}
            {jobSelected?.jobDescription?.length > 180 && (
              <Typography
                component="span"
                onClick={() => setShowFull(!showFull)}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  cursor: "pointer",
                  pl: 1,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {showFull ? "Ẩn bớt" : "Hiện thêm"}
              </Typography>
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "grey.300",
        p: 3,
        borderRadius: 3,
        minHeight: 500,
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" fontStyle="italic" color="text.secondary">
        Vui lòng chọn một công việc
      </Typography>
    </Box>
  );
};

export default JobDetails;
