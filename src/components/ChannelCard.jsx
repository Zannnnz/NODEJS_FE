import React from 'react';
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ChannelCard = ({ userId, channelDetail }) => {
  const avatarUrl = localStorage.getItem("USER_AVATAR") || "http://dergipark.org.tr/assets/app/images/buddy_sample.png";
  const userLogin = localStorage.getItem("LOGIN_USER");
  const fullName = localStorage.getItem("USER_FULL_NAME"); // Lấy tên người dùng từ local storage
  const userInfo = userLogin ? jwtDecode(userLogin) : null;
  const user_id = userInfo?.payload?.userId; // Lấy ID người dùng từ token

  const item = {
    demoProfilePicture: avatarUrl,
    title: fullName,
    subscriberCount: channelDetail?.subscriberCount || 1000000,
    channelId: channelDetail?.channelId || 1
  };

  return (
    <Box
      sx={{
        boxShadow: 'none',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: { xs: '356px', md: '320px' },
        height: '50px',
        margin: 'auto',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff' }}>
        <CardMedia
          image={item.demoProfilePicture}
          alt={item.title}
          sx={{ borderRadius: '50%', height: '180px', width: '180px', mb: 2, border: '1px solid #e3e3e3' }}
        />
        <Typography variant="h6">
          {item.title}
          <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
          <br />
          <Link to={`/info/${user_id}`} className='text-secondary fs-6'>
            Update info <i className='fa fa-edit'></i>
          </Link>
        </Typography>
        {item.subscriberCount && (
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: 'gray' }}>
            {parseInt(item?.subscriberCount).toLocaleString('en-US')} Subscribers
          </Typography>
        )}
      </CardContent>
    </Box>
  );
};

export default ChannelCard;
