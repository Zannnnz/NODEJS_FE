import { Avatar, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../utils/constants";
import { SearchBar } from "./";
import {jwtDecode} from "jwt-decode"; // Sửa lại import nếu có lỗi
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem("USER_AVATAR") || logo); // Sử dụng avatar từ localStorage
  const userLogin = localStorage.getItem("LOGIN_USER");
  const userInfo = userLogin ? jwtDecode(userLogin) : null;
  const user_id = userInfo?.payload?.userId; // Lấy ID người dùng từ token

  useEffect(() => {
    const storedAvatar = localStorage.getItem("USER_AVATAR");
    if (storedAvatar) {
      setAvatar(storedAvatar); // Cập nhật avatar khi có thay đổi trong localStorage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("LOGIN_USER"); // Xóa token người dùng
    localStorage.removeItem("USER_AVATAR"); // Xóa avatar người dùng
    setAvatar("http://dergipark.org.tr/assets/app/images/buddy_sample.png"); // Trả về logo mặc định
    window.location.reload(); // Làm mới trang
  };

  return (
    <Stack direction="row" alignItems="center" p={2} sx={{ background: '#000', top: 0, justifyContent: "space-between" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="logo"
          height={45}
          onClick={() => navigate("/")} // Điều hướng về trang chủ
        />
      </Link>
      <SearchBar />

      <div>
        {!userLogin ? (
          <div>
            <Link to="/login" className="text-white">Login | </Link>
            <Link to="/signup" className="text-white">Sign Up</Link>
          </div>
        ) : (
          <div className="dropdown">
            <Avatar
              src={avatar}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu">
              <Link to={`channel/${user_id}`}>
                <li><a className="dropdown-item" href="#">Kênh cá nhân</a></li>
              </Link>
              <Link to={`info/${user_id}`}>
                <li><a className="dropdown-item" href="#">Upload video</a></li>
              </Link>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={handleLogout} // Gọi hàm handleLogout khi đăng xuất
                >
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </Stack>
  );
}

export default Navbar;
