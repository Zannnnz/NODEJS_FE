import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { loginAPI, loginAsyncKey, loginFaceBooKAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";
import ReactFacebookLogin from 'react-facebook-login';


const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      <form className="row g-3 text-white">
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>

        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Password</label>
          <input className="form-control" id="pass" />
        </div>

        <div className="col-md-2">
          <label htmlFor="inputEmail4" className="form-label">Code</label>
          <input className="form-control" id="code" />
        </div>

        <div className="col-12">
          <button type="button" className="btn btn-primary" style={{ width: 145, margin: "10px" }}
            onClick={() => {
              let email = document.getElementById("email").value;
              let pass_word = document.getElementById("pass").value;
              let code = document.getElementById("code").value;
              console.log(email, pass_word, code);
              loginAsyncKey({
                email,
                pass_word,
                code
              })
                .then((result) => {
                  // result gồm message và data (access token)
                  //tạo pop up thanh báo thành công
                  toast.success(result.message);
                  // lưu access token trong local storage của browser
                  localStorage.setItem("LOGIN_USER", result.data)
                  //chuyển hướng sang trang chủ khi thành công
                  navigate("/");
                  window.location.reload()
                })
                .catch((error) => {
                  toast.error(error.response.data.message);
                })
            }
            }
          >Login</button>
          <Link
            style={{ width: 145, margin: "10px" }}
            className="btn btn-primary"
            to="/forgot-pass"
          >
            Forgot Password
          </Link>
          <ReactFacebookLogin
            appId="3771455953110034"
            fields="name,email,picture"
            cssClass="btn btn-primary"
            callback={(res) => {
              const { id, email, name } = res;
              loginFaceBooKAPI({ id, email, name })
                .then((result) => {
                  toast.success(result.message);
                  localStorage.setItem("LOGIN_USER", result.data);
                  navigate("/");
                })
                .catch((error) => {
                  console.log(error);
                  toast.error(error.message || "Facebook login error");
                });
            }}
            containerStyle={{
              marginLeft: '10px',
              width:'145px',
            }}
          />

        </div>
      </form>
    </div>
  </div>
};

export default Login;
