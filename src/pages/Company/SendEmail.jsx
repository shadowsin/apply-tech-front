import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { companyApi } from "../../utils/api/companyApi";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { address } from "../../actions/userAddress";

const SendEmail = () => {
  const params = useParams();

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      const getCompany = async () => {
        const data = await companyApi.getCompany(params.id);
        setCompany(data);
        setIsLoading(false);
      };
      getCompany();
    } else {
      return (window.location.href = "/");
    }
  }, [params.id]);

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${
      company.author.email
    }?subject=${encodeURIComponent(data.name)}&body=${encodeURIComponent(
      data.message
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <Box minHeight={"80vh"}>
      {isLoading ? (
        <LinearProgress color="error" />
      ) : (
        <Box sx={{ height: "80vh" }}>
          <Typography
            fontWeight={600}
            fontSize={40}
            align="center"
            color={"white"}
          >
            Get In Touch
          </Typography>
          <Typography
            align="center"
            color={"gray"}
            fontSize={20}
            maxWidth={800}
            margin={"auto"}
          >
            We&lsquo;ll create hight-quality linkable content build at least 40
            hight-authority links to each asset, paving the way for you grow
            your rankings, improve brand.
          </Typography>
          <Paper
            sx={{
              mt: 5,
              maxWidth: "50%",
              height: "70%",
              display: "flex",
              backgroundColor: "white",
              mx: "auto",
              borderRadius: 10,
            }}
          >
            <Box
              sx={{
                width: "40%",
                background: `linear-gradient(to right, black, #540509)`,
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Typography fontWeight={600} fontSize={25} color={"white"}>
                Contact Information
              </Typography>
              <Typography color={"white"}>
                We&lsquo;ll create hight-quanlity linkable content and build at
                least 40 hight-authority
              </Typography>

              <Box
                sx={{ my: 5, display: "flex", flexDirection: "column", gap: 3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <LocalPhoneIcon
                    sx={{ width: 60, height: 60, color: "white" }}
                  />
                  <Typography fontWeight={600} color={"white"}>
                    {company?.author?.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MailIcon sx={{ width: 60, height: 60, color: "white" }} />
                  <Typography fontWeight={600} color={"white"}>
                    {company?.author?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <LocationOnIcon
                    sx={{ width: 60, height: 60, color: "white" }}
                  />
                  <Typography fontWeight={600} color={"white"}>
                    {address(company?.author?.address)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                background: "white",
                width: "60%",
                borderRadius: 10,
                padding: 5,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <TextField
                  label="Your Name"
                  defaultValue={user?.name}
                  variant="standard"
                  color="error"
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Your Email"
                  defaultValue={user?.email}
                  variant="standard"
                  color="error"
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </Box>

              <TextField
                label="Your Subject"
                variant="standard"
                color="error"
                placeholder="I want to hire you quickly"
                fullWidth
              />
              <TextField
                label="Message"
                variant="standard"
                color="error"
                placeholder="Write here your message"
                fullWidth
                multiline={true}
                sx={{ maxHeight: 500, overflow: "auto" }}
                rows={5}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
              />

              <Button
                variant="contained"
                color="error"
                onClick={handleSendEmail}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SendEmail;
