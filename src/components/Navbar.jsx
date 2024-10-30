import { Avatar, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../utils/constants";
import { SearchBar } from "./";
import {jwtDecode} from "jwt-decode"; // Sửa lại import nếu có lỗi
import { useEffect, useState } from "react";
import { detailUser } from "../utils/fetchFromAPI"; // Giả sử có hàm này để lấy chi tiết người dùng từ API

const Navbar = () => {
  const defaultAvatar = "http://dergipark.org.tr/assets/app/images/buddy_sample.png";
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem("USER_AVATAR") || defaultAvatar); // Đặt logo mặc định khi chưa có avatar
  const userLogin = localStorage.getItem("LOGIN_USER");
  const userInfo = userLogin ? jwtDecode(userLogin) : null;
  const user_id = userInfo?.payload?.userId;

  useEffect(() => {
    if (userLogin && user_id) {
      // Lấy avatar từ database theo user_id
      detailUser(user_id)
        .then((data) => {
          if (data.avatarUrl) {
            localStorage.setItem("USER_AVATAR", data.avatarUrl); // Cập nhật avatar vào localStorage
            setAvatar(data.avatarUrl); // Cập nhật state avatar
          }
        })
        .catch((error) => {
          console.error("Error fetching avatar:", error);
          setAvatar(defaultAvatar); // Đặt avatar mặc định nếu xảy ra lỗi
        });
    } else {
      setAvatar(defaultAvatar); // Nếu chưa đăng nhập, đặt avatar mặc định
    }
  }, [userLogin, user_id]);

  const handleLogout = () => {
    localStorage.removeItem("LOGIN_USER"); // Xóa token
    
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <Stack direction="row" alignItems="center" p={2} sx={{ background: '#000', top: 0, justifyContent: "space-between" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="logo" height={45} onClick={() => navigate("/")} />
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
            <Avatar src={avatar} type="button" data-bs-toggle="dropdown" aria-expanded="false" />
            <ul className="dropdown-menu">
              <Link to={`channel/${user_id}`}>
                <li className="dropdown-item">Kênh cá nhân</li>
              </Link>
              <Link to={`info/${user_id}`}>
                <li className="dropdown-item">Upload video</li>
              </Link>
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default Navbar;