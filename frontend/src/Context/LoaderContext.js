import React, { createContext, useContext, useState } from 'react';
import { Backdrop, Box, Typography } from '@mui/material';
import { CirclesWithBar } from 'react-loader-spinner';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);

  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Backdrop 
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background-color 0.3s ease', 
        }} 
        open={loading}
      >
        <Box 
          sx={{
            textAlign: 'center',
            padding: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 3, 
          }}
        >
          <CirclesWithBar
            size={15}
            color="#4caf50"
            margin={2}
            speedMultiplier={1}
            ariaLabel="loading"
          />
          <Typography variant="h6" color="white" sx={{ marginTop: 2 }}>Loading...</Typography>
        </Box>
      </Backdrop>
    </LoaderContext.Provider>
  );
};


export const useLoader = () => {
  return useContext(LoaderContext);
};
