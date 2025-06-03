import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Rate } from "rsuite";
import { commentApi } from "../utils/api/commentApi";

const Comment = ({ comments = [], company }) => {
  const user = useSelector((state) => state.user.user);
  const [content, setContent] = useState("");
  const [rate, setRate] = useState(5);

  const handleComment = async (parrentId) => {
    const data = {
      company: company._id,
      user: user._id,
      content,
      parrentId: parrentId || null,
      rate,
    };
    try {
      await toast.promise(commentApi.addComment(data), {
        loading: "Đang bình luận",
        success: "Bình luận thành công",
        error: "Bình luận thất bại",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const rateAverage =
    comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length;

  // const handleLike = (id, action) => {};
  const handleDeleteComment = async (id) => {
    try {
      await toast.promise(commentApi.deleteComment(id), {
        loading: "Đang xóa bình luận",
        success: "Xóa bình luận thành công",
        error: "Xóa bình luận thất bại",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper sx={{ p: 3, px: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 5, mb: 2 }}>
        <Typography sx={{ fontSize: 23, fontWeight: 600 }}>Đánh giá</Typography>
        <Rate value={rateAverage} readOnly />
        <Typography sx={{ fontSize: 20 }}>
          Có {comments.length} đánh giá
        </Typography>
      </Box>
      {!user ? null : comments.find((c) => c.user._id === user._id) ? null : (
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Thêm đánh giá</Typography>
          <Box sx={{ py: 2, display: "flex", flexDirection: "column" }}>
            <Rate defaultValue={5} color="red" onChange={(e) => setRate(e)} />

            <Box sx={{ display: "flex", gap: 3 }}>
              <TextField
                label={user?.name}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ my: 2 }}
              />
              <Button size="small" onClick={() => handleComment(null)}>
                Gửi
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box>
        {comments.map((comment) => (
          <Box key={comment._id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Avatar
                src={comment.user.avatar}
                alt={"user_avatar"}
                sx={{ width: 60, height: 60 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "start",
                }}
              >
                <Typography fontSize={20} fontWeight={600}>
                  {comment.user.name}
                </Typography>
                <Typography fontStyle={"italic"} fontSize={13}>
                  @{comment.user.username}
                </Typography>
              </Box>

              <Rate
                value={comment.rate}
                style={{ justifyContent: "end", flexGrow: 1 }}
                size="xs"
                readOnly
              />
            </Box>

            <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography fontSize={20}>{comment.content}</Typography>

              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "end",
                }}
              >
                <IconButton onClick={() => handleLike(comment._id, "like")}>
                  <ThumbDownAltIcon color="error" />
                </IconButton>
                <IconButton onClick={() => handleLike(comment._id, "dislike")}>
                  <ThumbUpIcon color="primary" />
                </IconButton>
              </Box> */}

              {!user
                ? null
                : user.role === "admin" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </Button>
                  )}
            </Box>

            <Divider />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Comment;
