import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setModal } from "../slice/companySlice";
import { address } from "../actions/userAddress";

const CompanyItem = ({
  name,
  image,
  scale,
  country,
  ot,
  website,
  social,
  address: companyAddress,
  ...company
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(
      setModal({
        show: true,
        data: {
          name,
          image,
          scale,
          country,
          ot,
          website,
          social,
          address: companyAddress,
          ...company,
        },
      })
    );
  };

  return (
    <Card
      sx={{
        width: 400,
        maxWidth: "100%",
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s ease",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-3px)",
        },
      }}
    >
      {image && (
        <CardMedia
          component="img"
          image={image}
          alt={`${name} Logo`}
          sx={{
            objectFit: "cover",
            bgcolor: "grey.100",
            overflow: "hidden",
            height: 300,
          }}
        />
      )}

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          py: 2,
          height: "100%",
          maxHeight: 400,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          {name}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={1}>
          <Info label="Địa chỉ" value={address(companyAddress)} />
          <Info label="Quy mô" value={scale ? `${scale} km` : "-"} />
          <Info label="Quốc gia" value={country || "-"} />
          <Info label="Làm thêm giờ" value={ot || "-"} />
          <Info
            label="Website"
            value={
              website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    wordBreak: "break-word",
                  }}
                >
                  {website}
                </a>
              ) : (
                "-"
              )
            }
          />
          <Info label="Mạng xã hội" value={social || "-"} />
        </Stack>
      </CardContent>

      <Box sx={{ px: 2, pb: 2, paddingTop: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleUpdate}
          sx={{
            paddingTop: "auto",
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow: "none",
            },
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
};

const Info = ({ label, value }) => (
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{
      display: "flex",
      gap: 0.5,
      alignItems: "center",
      lineHeight: 1.6,
    }}
  >
    <strong style={{ minWidth: 90 }}>{label}:</strong> {value}
  </Typography>
);

export default CompanyItem;
