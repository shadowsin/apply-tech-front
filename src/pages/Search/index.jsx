import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TypingEffect from "./TitleType";
import imgAI from "../../assets/images/aiImage.png";
import SearchContent from "./SearchContent";
import { selectUser } from "../../slice/messageSlice";

const placeholders = [
  "Cách tìm việc ngành công nghệ thông tin",
  "Công ty tuyển dụng IT hàng đầu",
  "Việc làm lập trình viên tại Việt Nam",
  "Kinh nghiệm viết CV ngành IT",
  "Tìm việc làm trong lĩnh vực AI và Machine Learning",
  "Việc làm công nghệ thông tin cho sinh viên mới ra trường",
  "Các kỹ năng cần thiết để xin việc IT",
  "Làm sao để trở thành lập trình viên Full-stack",
  "Công ty tuyển dụng DevOps Engineer",
  "Cách chuẩn bị phỏng vấn vị trí kỹ sư phần mềm",
  "Những ngôn ngữ lập trình được ưa chuộng năm 2024",
  "Tìm việc làm Remote ngành IT",
  "Việc làm Blockchain Developer",
  "Hướng dẫn viết portfolio cho dân IT",
  "Tìm việc trong lĩnh vực An toàn thông tin",
  "Top công ty IT tại TP. Hồ Chí Minh",
  "Việc làm UI/UX Designer",
  "Những vị trí IT có mức lương cao",
  "Thị trường việc làm ngành công nghệ thông tin 2024",
  "Làm sao để chuyển ngành sang công nghệ thông tin",
];

const Search = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery) return;
    if (!user) return toast.error("Bạn cần phải đăng nhập trước");
    setIsSearched(true);
    window.sessionStorage.setItem("searchQuery", searchQuery);
    dispatch(
      selectUser({
        user: {
          _id: "AI",
          name: "AI tư vấn",
          avatar:
            "https://th.bing.com/th/id/OIG1.0iHLQGIL88czg6qKTKKz?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        lastMessage: "",
        time: "now",
        seen: true,
      })
    );
  }, []);

  const handleKeyPress = useCallback(() => {
    if (event.key === "Enter") {
      handleSearch();
    } else return null;
  }, [handleSearch]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "linear-gradient(180deg, #0d0d0d, #1a1a1a)",
        color: "#fff",
      }}
    >
      {!isSearched ? (
        <>
          <img
            src={imgAI}
            style={{
              height: 200,
              borderRadius: "100px",
              objectFit: "cover",
              margin: "100px",
            }}
          />
          {/* Title */}
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            <TypingEffect text="Tìm kiếm công việc bằng AI" />
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 500,
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              // placeholder="Nhập từ khoá tìm kiếm..."
              placeholder={placeholders[placeholderIndex]}
              variant="outlined"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              sx={{
                input: {
                  background: "linear-gradient(90deg, #8e44ad, #e74c3c)",
                  color: "white",
                  borderRadius: 50,
                },
                borderRadius: 50,
                background: "linear-gradient(90deg, #8e44ad, #e74c3c)",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent", // Xóa viền khi focus
                  },
                },
              }}
              InputProps={{
                sx: {
                  paddingRight: 6,
                },
                endAdornment: (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 8,
                      transform: "translateY(-50%)",
                      color: "#fff",
                    }}
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </>
      ) : (
        <SearchContent searchQuery={searchQuery} />
      )}
    </Box>
  );
};

export default Search;
