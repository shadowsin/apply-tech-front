import { Box, LinearProgress } from "@mui/material";
import CompanyModal from "../../components/CompanyModal";
import CompanyItem from "../../components/CompanyItem";
import JobModal from "../../components/JobModal";
import Popup from "../../components/Popup";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { companyApi } from "../../utils/api/companyApi";

const Company = () => {
  const user = useSelector((state) => state.user.user);

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const modal = useSelector((state) => state.company.modal);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await companyApi.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getCompanies();
  }, [modal]);

  return isLoading ? (
    <LinearProgress color="error" />
  ) : (
    <Box>
      <Box p={2} sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {companies?.length
          ? companies.map((company) => (
              <CompanyItem key={company._id} {...company} />
            ))
          : null}
      </Box>
      {user.role === "company" && companies.length ? null : <Popup />}
      <CompanyModal />
      <JobModal />
    </Box>
  );
};

export default Company;
