import { useEffect, useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { faqApi } from "../../utils/api/faqApi";

const Faq = () => {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await faqApi.gets();
      setFaq(result);
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{ height: "80vh", overflow: "auto" }}
      className="bg-gradient-to-r from-black to-red-900"
    >
      <Container
        sx={{ py: 5, display: "flex", flexDirection: "column", gap: 3 }}
      >
        {faq.map((data) => (
          <Paper
            key={data._id}
            sx={{ display: "flex", flexDirection: "column", padding: 2 }}
          >
            <Typography fontSize={20} fontWeight={600}>
              {data.question}
            </Typography>
            <Typography
              sx={{
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {data.answer}
            </Typography>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default Faq;
