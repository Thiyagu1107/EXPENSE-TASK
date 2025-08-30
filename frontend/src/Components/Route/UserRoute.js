import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/auth';
import axios from 'axios';
import { Outlet } from 'react-router-dom'; // Added Navigate for potential redirection
import Spinner from '../../Utils/Spinner';

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth/userdashboard`, {
          headers: {
            Authorization: auth?.token
          },
        });

        // Check the response from the server
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setOk(false);
      }
    };

    // Check authentication only if auth.token is present
    if (auth?.token) {
      authCheck();
    } else {
      setOk(false); // If no token, set ok to false
    }
  }, [auth?.token, backendUrl]);

  // If not authorized, you can redirect to a login page or show a spinner
  if (!ok) {
    return <Spinner />;
  }

  return <Outlet />;
}
