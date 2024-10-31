import { Avatar, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../utils/constants";
import { SearchBar } from "./";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import { useEffect, useState } from "react";
import { detailUser } from "../utils/fetchFromAPI"; // Assuming this function retrieves user details from the API

const Navbar = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("http://dergipark.org.tr/assets/app/images/buddy_sample.png"); // Default avatar
  const userLogin = localStorage.getItem("LOGIN_USER");
  const userInfo = userLogin ? jwtDecode(userLogin) : null;
  const user_id = userInfo?.payload?.userId; // Use the userId from token

  useEffect(() => {
    if (user_id) {
      // Fetch the avatar from the database using user_id
      detailUser(user_id)
        .then((data) => {
          // Log the fetched data for debugging
          console.log("User data fetched:", data);
          
          // Check if avatar exists and set it accordingly
          if (data.avatar) {
            const avatarUrl = `http://localhost:8080/${data.avatar}`;
            setAvatar(avatarUrl);
            localStorage.setItem("USER_AVATAR", avatarUrl); // Save avatar to localStorage
          } else {
            console.warn("Avatar not found in user data, using default avatar.");
          }
        })
        .catch((error) => {
          console.error("Error fetching avatar:", error);
        });
    }
  }, [user_id]);

  const handleLogout = () => {
    localStorage.removeItem("LOGIN_USER"); // Remove token
    localStorage.removeItem("USER_AVATAR")
    navigate("/"); // Navigate to home
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
            <Avatar 
              src={avatar} 
              alt="User Avatar" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false" 
              onError={(e) => {
                e.target.onerror = null; // Prevents looping
                e.target.src = "http://dergipark.org.tr/assets/app/images/buddy_sample.png"; // Fallback to default avatar
              }} 
            />
            <ul className="dropdown-menu">
              <Link to={`channel/${user_id}`} style={{ textDecoration: 'none' }}>
                <li className="dropdown-item">Kênh cá nhân</li>
              </Link>
              <Link to={`info/${user_id}`} style={{ textDecoration: 'none' }}>
                <li className="dropdown-item">Update Info</li>
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