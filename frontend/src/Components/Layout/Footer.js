import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        textAlign: 'center',
        bgcolor: 'background.paper',
        width: '100%',     
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2f6', borderRadius: '12px', 
      }}
    >
      <Typography 
        variant="body2" 
        color="textSecondary" 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        All Rights Reserved &copy; Expense Tracker
      </Typography>
      </Box>
  );
};

export default Footer;
