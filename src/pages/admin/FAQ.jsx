import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";

import { setFaqCreateModal } from "../../slice/faqSlice";
import FaqModel from "../../components/FaqModel";
import { faqApi } from "../../utils/api/faqApi";

const AdminFAQ = () => {
  const dispatch = useDispatch();
  const [faq, setFaq] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const createModal = useSelector((state) => state.faq.createModal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await faqApi.gets();
        setFaq(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [createModal]);

  const handleAdd = () => {
    dispatch(
      setFaqCreateModal({
        open: true,
        data: null,
      })
    );
  };
  const handleUpdate = (faq) => {
    dispatch(
      setFaqCreateModal({
        open: true,
        data: faq,
      })
    );
  };

  return isLoading ? (
    <LinearProgress color="error" />
  ) : (
    <div>
      <Box p={5} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {faq.map((faq) => (
          <Paper
            sx={{
              width: 200,
              height: 100,
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            key={faq._id}
            onClick={() => handleUpdate(faq)}
          >
            <Typography fontWeight={600} color={"#93173B"}>
              {faq.question.length > 70
                ? faq.question.slice(0, 70) + "..."
                : faq.question}
            </Typography>
          </Paper>
        ))}
        <Paper
          sx={{
            width: 100,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            sx={{ fontSize: 20, width: "100%", height: "100%", color: "red" }}
            onClick={handleAdd}
          >
            +
          </Button>
        </Paper>
      </Box>
      <FaqModel />
    </div>
  );
};

export default AdminFAQ;
