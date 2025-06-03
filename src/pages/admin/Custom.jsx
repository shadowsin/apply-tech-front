import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Container, Paper, TextField } from "@mui/material";
import { customSystemApi } from "../../utils/api/customSystemApi";

const Custom = () => {
  const [openaiKey, setOpenaiKey] = useState(null);

  useEffect(() => {
    const getOpenaiKey = async () => {
      const { key } = await customSystemApi.getOpenaiKey();
      setOpenaiKey(key);
    };
    getOpenaiKey();
  }, []);

  const handleUpdateOpenaiKey = async () => {
    try {
      const { key } = await toast.promise(
        customSystemApi.updateOpenaiKey({ openaiKey }),
        {
          loading: "Đang cập nhật...",
          success: "Cập nhật thành công",
          error: "Cập nhật thất bại",
        }
      );
      setOpenaiKey(key);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container sx={{ p: 5 }}>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          width: 500,
          padding: 1,
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          label="OpenAI Key"
          value={openaiKey}
          variant="outlined"
          onChange={(e) => setOpenaiKey(e.target.value)}
        />
        <Button onClick={handleUpdateOpenaiKey}>Update</Button>
      </Paper>
    </Container>
  );
};

export default Custom;
