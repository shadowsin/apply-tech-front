import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import toast from "react-hot-toast";

import { getCurrentAddress } from "../../actions/getCurrentAddress";
import { userApi } from "../../utils/api/userApi";
import { address } from "../../actions/userAddress";
import { data } from "../../sources/data";
import aiImg from "../../assets/images/__.gif";

const SelectActions = ({
  name,
  data = [],
  keyName,
  dataFilter,
  setDataFilter,
}) => (
  <FormControl className="bg-white w-full md:w-[32%] rounded">
    <InputLabel className="!text-red-600 !font-bold">{name}</InputLabel>
    <Select
      value={dataFilter[keyName]}
      label={name}
      onChange={(e) =>
        setDataFilter((prev) => ({
          ...prev,
          [keyName]: e.target.value,
        }))
      }
    >
      {data.map((v, i) => (
        <MenuItem value={v.value} key={i}>
          {v.value}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const Filter = (props) => {
  const {
    handleSearch,
    searchQuery,
    setSearchQuery,
    dataFilter,
    setDataFilter,
  } = props;

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const searchHistory = JSON.parse(localStorage.getItem("search")) ?? [];

  const handleGetCurrentAddress = () => {
    if (!user) return navigate("/dang-nhap");
    getCurrentAddress().then(async (data) => {
      const newAddress = {
        province: data?.address?.features[0]?.properties?.city,
        district: data?.address?.features[0]?.properties?.suburb,
        ward: data?.address?.features[0]?.properties?.road,
        lat: data.lat,
        lng: data.lng,
      };

      const confirmed = window.confirm("Bạn có muốn cập nhật địa chỉ mới?");
      if (confirmed) {
        try {
          await toast.promise(userApi.updateAddress(newAddress), {
            loading: "Đang cập nhật",
            success: "Cập nhật thành công",
            error: "Cập nhật thất bại",
          });
          window.location.reload();
        } catch (error) {
          console.log(error);
          toast.error("Cập nhật thất bại");
        }
      }
    });
  };

  return (
    <Box className="w-full pt-3! lg:w-2/3 mx-auto! md:px-10 py-3 flex flex-col justify-center md:flex-row gap-4 items-center px-5! pb-5!">
      <Box className="flex flex-wrap gap-3 flex-1 justify-between">
        {/* Địa chỉ người dùng */}
        <Button
          variant="text"
          onClick={handleGetCurrentAddress}
          className="!text-white !px-3 !py-2 !bg-transparent !hover:bg-gray-700 rounded-md flex gap-2 items-center mx-auto!"
        >
          <LocationOnIcon className="text-white" fontSize="small" />
          <Typography color="white" fontWeight={600} fontSize={16}>
            {user?.address ? address(user.address) : "Thêm địa chỉ"}
          </Typography>
        </Button>

        <Box className="relative w-full bg-white rounded-md mb-1.5!">
          <TextField
            placeholder="Nhập từ khóa kỹ năng, công ty,..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery}
            style={{
              background: `url(${aiImg}) center center no-repeat`,
              backgroundSize: "cover",
              position: "absolute",
              right: 10,
              top: -4,
              padding: "5px 10px",
              transform: "translateY(50%)",
              borderRadius: "20px",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-6 py-2 flex items-center gap-2"
          >
            Tìm kiếm
          </Button>
        </Box>

        {/* Select dropdowns */}
        <SelectActions
          name="Mức lương"
          keyName="salary"
          data={data.salary}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
        <SelectActions
          name="Hình thức làm việc"
          keyName="wotkingForm"
          data={data.workForm}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
        <SelectActions
          name="Thời gian"
          keyName="time"
          data={data.time}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
      </Box>
    </Box>
  );
};

export default Filter;
