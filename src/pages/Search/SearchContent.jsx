import { Paper } from "@mui/material";

const SearchContent = ({ searchQuery }) => {
  return (
    <Paper
      sx={{
        height: "80vh",
        width: "60%",
        padding: 4,
        backdropFilter: "100px",
        backgroundColor: "rgba(255, 255, 255, .3)",
      }}
    >
      {/* <Chat searchQuery={searchQuery} /> */}
    </Paper>
  );
};

export default SearchContent;
