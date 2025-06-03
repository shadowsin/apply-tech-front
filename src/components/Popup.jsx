import { useDispatch } from "react-redux";
import { Box, SpeedDial } from "@mui/material";

import { setModal } from "../slice/companySlice";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";

const Popup = () => {
  const dispatch = useDispatch();
  const handleCreateCompany = () => {
    dispatch(setModal({ show: true }));
  };

  return (
    <Box
      sx={{
        height: "80%",
        width: "100%",
      }}
    >
      <SpeedDial
        onClick={handleCreateCompany}
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
      ></SpeedDial>
    </Box>
  );
};

export default Popup;
