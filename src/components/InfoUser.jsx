import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  detailUser,
  uploadfile,
  updateUser,
  uploadVideoAndThumbnail,
} from "../utils/fetchFromAPI";
import ReactPlayer from "react-player";

const InfoUser = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [avatar, setAvatar] = useState("http://dergipark.org.tr/assets/app/images/buddy_sample.png");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState(""); // State to store thumbnail URL
  const formFile = useRef();
  const formFileVideo = useRef();
  const formFileThumbnail = useRef();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    detailUser(id)
      .then((result) => {
        setChannelDetail(result);
        const avatarUrl = `http://localhost:8080/${result.avatar}`;
        setAvatar(avatarUrl);
        localStorage.setItem("USER_AVATAR", avatarUrl);
        setFullName(result.full_name);
        setEmail(result.email);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleUpload = async () => {
    const file = formFile.current.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("hinhanh", file);

    try {
      const result = await uploadfile(id, formData);
      if (result.data) {
        setAvatar(`http://localhost:8080/${result.data.url}?t=${new Date().getTime()}`);
        toast.success("Avatar uploaded successfully");
      }
    } catch (error) {
      toast.error("Error uploading avatar");
      console.error("Upload avatar error:", error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAndUpdateVideo = async () => {
    const file = formFileVideo.current.files[0];
    const thumbnailFile = formFileThumbnail.current.files[0];

    if (!file || !thumbnailFile || !videoTitle || !videoDescription) {
      toast.error("Please select video and thumbnail files, and provide title and description.");
      return;
    }

    const formData = new FormData();
    formData.append("source", file);
    formData.append("thumbnail", thumbnailFile);
    formData.append("video_name", videoTitle);
    formData.append("description", videoDescription);

    try {
      const videoResult = await uploadVideoAndThumbnail(id, formData);
      if (videoResult.data) {
        setVideoURL(`http://localhost:8080/${videoResult.data.url}?t=${new Date().getTime()}`);
        setVideoId(videoResult.data.video_id);
        toast.success("Video uploaded successfully");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Error uploading video or thumbnail";
        toast.error(errorMessage);
        console.error("Upload video or thumbnail error:", error);
      } else {
        toast.error("Network error: Please check your connection.");
        console.error("Network error:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!password) {
      toast.error("Password is required.");
      return;
    }
  
    const payload = {
      full_name: fullName,
      pass_word: password,
      email: email,
    };
  
    try {
      const result = await updateUser(id, payload);
      if (result && result.message) {
        await handleUpload();
        localStorage.setItem("USER_FULL_NAME", fullName);
        toast.success(result.message);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error updating user");
      }
      console.error("Update user error:", error);
    }
  };
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "95vh" }}>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className="nav-link active"
            id="nav-home-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-home"
            type="button"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            Info
          </button>
          <button
            className="nav-link"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
          >
            Update Video
          </button>
        </div>
      </nav>
      <div className="tab-content mt-3" id="nav-tabContent">
        <div
          className="tab-pane fade show active"
          id="nav-home"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
          tabIndex={0}
        >
          <div className="row">
            <div className="col-2" style={{ justifyContent: "center", alignItems: "center", display: "flex", flexWrap: "wrap" }}>
              <img
                className="rounded-circle"
                src={avatar}
                width="150"
                style={{ height: "150px", objectFit: "cover" }}
                alt="Avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://dergipark.org.tr/assets/app/images/buddy_sample.png";
                }}
              />
              <input
                className="form-control"
                type="file"
                id="formFile"
                ref={formFile}
                onChange={handleAvatarChange}
              />
            </div>
            <div className="col-10">
              <form className="row g-3 text-white">
                <div className="col-md-6">
                  <label htmlFor="inputFullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputFullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    value={email}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
          tabIndex={0}
        >
          <div className="row">
            <div className="col-12">
              <form className="row g-3 text-white">
                <div className="col-md-12">
                  <label htmlFor="inputVideoSource" className="form-label">Video Source</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="video/*"
                    id="formVideoSource"
                    ref={formFileVideo}
                    onChange={(e) => setVideoURL(URL.createObjectURL(e.target.files[0]))}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputVideoTitle" className="form-label">Video Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputVideoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputVideoDescription" className="form-label">Video Description</label>
                  <textarea
                    className="form-control"
                    id="inputVideoDescription"
                    rows="3"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputThumbnail" className="form-label">Thumbnail</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    id="formThumbnail"
                    ref={formFileThumbnail}
                    onChange={handleThumbnailChange}
                  />
                 
                </div>
                <div className="col-md-12 d-flex">
                  <div className="col-md-6">
                  {thumbnailURL && (
                    <img
                      src={thumbnailURL}
                      alt="Thumbnail Preview"
                      style={{ width: "200px", marginTop: "10px" }}
                    />
                  )}
                  </div>
                   <div className="col-md-6">
                   {videoURL && (
                    <ReactPlayer url={videoURL} controls width="100%" />
                    )}
                   </div>
                  
                </div>
               
                <div className="col-12">
                  <button type="button" className="btn btn-primary" onClick={handleUploadAndUpdateVideo}>
                    Upload Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
