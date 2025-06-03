import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { PROVINCE_DATA } from "../sources/data";

const UserAddress = ({ user, setUser }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    !provinces?.length && setProvinces(PROVINCE_DATA);
    if (address?.province_id?.districts?.length) {
      setDistricts(address?.province_id?.districts);

      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          province: address?.province_id?.name || prev.address.province,
        },
      }));
    }
    if (address?.district_id?.wards?.length) {
      setWards(address?.district_id?.wards);
      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          district: address?.district_id?.name || prev.address.district,
        },
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
          defaultValue={user?.address?.province}
          label="Tỉnh thành"
          onChange={(e) => {
            setAddress((prev) => ({
              ...prev,
              province_id: JSON.parse(e.target.value),
            }));
          }}
        >
          {provinces.map((province) => (
            <MenuItem key={province?.code} value={JSON.stringify(province)}>
              {province?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "45%" }}>
        <InputLabel>Quận huyện</InputLabel>
        <Select
          defaultValue={user?.address?.district}
          label="Quận huyện"
          onChange={(e) => {
            setAddress((prev) => ({
              ...prev,
              district_id: JSON.parse(e.target.value),
            }));
          }}
        >
          {districts.map((district) => (
            <MenuItem key={district?.code} value={JSON.stringify(district)}>
              {district?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "45%" }}>
        <InputLabel>Phường xã</InputLabel>
        <Select
          defaultValue={user?.address?.ward}
          label="Phường xã"
          onChange={(e) => {
            setUser((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                ward: e.target.value,
              },
            }));
          }}
        >
          {wards.map((ward) => (
            <MenuItem key={ward?.ward_id} value={ward?.name}>
              {ward?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Đường"
        name="Đường"
        sx={{ width: "45%" }}
        defaultValue={user?.address?.street}
        onChange={(e) =>
          setUser((prev) => ({
            ...user,
            address: {
              ...prev.address,
              street: e.target.value,
            },
          }))
        }
      />
    </Box>
  ) : (
    <LinearProgress />
  );
};

export default UserAddress;
