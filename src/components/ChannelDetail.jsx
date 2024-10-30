import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import { Videos, ChannelCard } from "./";
import { jwtDecode } from "jwt-decode";
import { getVideoByUserid } from "../utils/fetchFromAPI";
const ChannelDetail = () => {
  const [videos, setVideos] = useState(null);
  const [channelDetail, setChannelDetail] = useState(); // Thêm lại state cho channelDetail
  const { id } = useParams();
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const videoData = await getVideoByUserid(id);
        setVideos(videoData);
        
        // Lấy thông tin channelDetail từ localStorage hoặc API nếu cần
        const userLogin = localStorage.getItem("LOGIN_USER");

        const userInfo = userLogin ? jwtDecode(userLogin) : null;

        setChannelDetail({
          fullName: localStorage.getItem("USER_FULL_NAME") || "Default Name",
          avatarUrl: localStorage.getItem("USER_AVATAR") || "http://dergipark.org.tr/assets/app/images/buddy_sample.png",
          subscriberCount: 1000, // hoặc lấy từ API nếu cần
          userId: userInfo?.payload?.userId || id, // Lấy userId từ token
        });
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchResults();
  }, [id]);

  return (
    <Box minHeight="95vh">
      <Box>
        <div style={{
          height: '300px',
          background: 'linear-gradient(90deg, rgba(0,238,247,1) 0%, rgba(206,3,184,1) 100%, rgba(0,212,255,1) 100%)',
          zIndex: 10,
        }} />
        
        {channelDetail && <ChannelCard channelDetail={channelDetail} marginTop="-93px" />} {/* Chỉ hiển thị nếu có channelDetail */}

      </Box>

      <Box p={2} display="flex" style={{ marginTop: 150 }}>
        <Box sx={{ mr: { sm: '100px' } }} />
        <Videos videos={videos} />
      </Box>
    </Box>
  );
};

export default ChannelDetail;
