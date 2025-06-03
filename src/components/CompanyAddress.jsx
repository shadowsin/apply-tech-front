import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PROVINCE_DATA } from "../sources/data";

const CompanyAddress = ({ setInitialAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    !provinces?.length && setProvinces(PROVINCE_DATA);
    if (address?.province_id?.districts?.length) {
      setDistricts(address?.province_id?.districts);
      setInitialAddress((prev) => ({
        ...prev,
        province: address?.province_id?.name,
      }));
    }
    if (address?.district_id?.wards?.length) {
      setWards(address?.district_id?.wards);
      setInitialAddress((prev) => ({
        ...prev,
        district: address?.district_id?.name,
      }));
    }
  }, [address, provinces?.length]);

  return provinces?.length ? (
    <Box
      sx={{
        display: "flex",
        paddingY: 2,
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      <FormControl sx={{ width: "45%" }}>
        <InputLabel>Tỉnh thành</InputLabel>
        <Select
          defaultValue={address?.province}
          label="Tỉnh thành"
          onChange={(e) => {
            setAddress((prev) => ({
              ...prev,
              province_id: JSON.parse(e.target.value),
            }));
          }}
        >
          {provinces.map((province) => (
            <MenuItem
              key={province?.province_id}
              value={JSON.stringify(province)}
            >
              {province?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "45%" }}>
        <InputLabel>Quận/huyện</InputLabel>
        <Select
          defaultValue={address?.district}
          label="Quận/huyện"
          onChange={(e) => {
            setAddress((prev) => ({
              ...prev,
              district_id: JSON.parse(e.target.value),
            }));
          }}
        >
          {districts?.map((district) => (
            <MenuItem key={district?.code} value={JSON.stringify(district)}>
              {district?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "45%" }}>
        <InputLabel>Phường/xã</InputLabel>
        <Select
          defaultValue={address?.ward}
          label="Phường/xã"
          onChange={(e) => {
            setInitialAddress((prev) => ({
              ...prev,
              ward: e.target.value,
            }));
          }}
        >
          {wards.map((ward) => (
            <MenuItem key={ward?.code} value={ward?.name}>
              {ward?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Đường"
        name="street"
        sx={{ width: "45%" }}
        onChange={(e) =>
          setInitialAddress((prev) => ({
            ...prev,
            street: e.target.value,
          }))
        }
      />
    </Box>
  ) : (
    <LinearProgress />
  );
};

export default CompanyAddress;
