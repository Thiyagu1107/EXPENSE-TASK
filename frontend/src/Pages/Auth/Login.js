import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, IconButton, InputAdornment, Link as MuiLink } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import logo from "../../assets/images/LOGO.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../Context/auth';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/auth/login`, { email, password });
      if (res.data.success) {
     
        setAuth({ user: res.data.user, token: res.data.token });
        Cookies.set('auth', JSON.stringify(res.data), { expires: 1 }); 

        const dashboardRoute = `/dashboard/${res.data.user.role === 1 ? "admin" : "user"}`;
        toast.success(res.data.message);
        setTimeout(() => {
          navigate(location.state || dashboardRoute);
        }, 500); 
      } else {
        toast.error(res.data.error || res.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(238, 242, 246)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <Container maxWidth="xs">
    <ToastContainer />
    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="logo" style={{ width: 100, height: 'auto', marginBottom: 20 }} />
        <Typography
          component="h1"
          variant="h5"
          style={{
            margin: '0px 0px 0.35em',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            lineHeight: 1.2,
            color: 'rgb(103, 58, 183)',
          }}
        >
          Hi, Welcome Back
        </Typography>
        <Typography
          component="h2"
          variant="subtitle1"
          style={{
            margin: 0,
            color: 'rgb(105, 117, 134)',
            fontWeight: 400,
            fontFamily: 'Roboto, sans-serif',
            lineHeight: 1.66,
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Enter your credentials to continue
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                error={email.length > 0 && !/\S+@\S+\.\S+/.test(email)}
                helperText={email.length > 0 && !/\S+@\S+\.\S+/.test(email) ? 'Invalid email address' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{
              margin: '24px 0px 16px',
              backgroundColor: '#6200ea',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Sign In
          </Button>
        </form>
      </div>
      </div>
      </Container>
      </div>
  );
}

export default Login;
