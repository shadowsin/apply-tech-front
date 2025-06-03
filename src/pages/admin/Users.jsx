import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { setModal } from "../../slice/userSlice";
import UpdateUserModal from "../../components/UpdateUserModal";
import { userApi } from "../../utils/api/userApi";

export default function Users() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await userApi.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleEdit = (user) => {
    dispatch(setModal({ show: true, data: user }));
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default" }}>
      {isLoading ? (
        <LinearProgress color="primary" sx={{ my: 2 }} />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.100" }}>
                  Tên tài khoản
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Số điện thoại
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Giới tính
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Ngày sinh
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Quyền hạn
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, bgcolor: "grey.100" }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.length ? (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {user?.username || "-"}
                    </TableCell>
                    <TableCell align="right">{user?.email || "-"}</TableCell>
                    <TableCell align="right">{user?.phone || "-"}</TableCell>
                    <TableCell align="right">
                      {user?.gender === "male"
                        ? "Nam"
                        : user?.gender === "female"
                        ? "Nữ"
                        : "Khác"}
                    </TableCell>
                    <TableCell align="right">
                      {user?.birthday
                        ? moment(user.birthday).format("DD/MM/YYYY")
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {user?.role === "admin"
                        ? "Quản trị"
                        : user?.role === "company"
                        ? "Công ty"
                        : "Người dùng"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(user)}
                        aria-label="edit user"
                      >
                        <EditNoteIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      Chưa có người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UpdateUserModal />
    </Box>
  );
}
