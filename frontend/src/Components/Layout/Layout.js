import React, { useState, useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import logo from "../../assets/images/LOGO.png";
import { useAuth } from '../../Context/auth';
import adminNavigationItems from './AdminNavigationItems';
import userNavigationItems from './UserNavigationItems';
import AccountMenu from './AccountMenu';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#F8F7FA',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Layout = ({ 
  children, 
  title = "Expense Tracker", 
  description = "Digital moi", 
  keywords = "Expense Tracker", 
  author = "thiyagu"
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const drawerRef = useRef(null);
  const { auth } = useAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleExpandClick = (index) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const getNavigationItems = () => {
    if (auth?.user?.role === 1) {
      return adminNavigationItems;
    } else {
      return userNavigationItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Box sx={{ display: 'flex' }} ref={drawerRef}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
          
            <Typography variant="body" sx={{ marginRight: 5, fontFamily: 'Nunito Sans', fontSize: '1.25rem', color: 'rgb(18, 25, 38)', fontWeight: 600, lineHeight: 1.167 }} >
           Expense Tracker
            </Typography>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                color: '#3949ab', 
                backgroundColor:'#e8eaf6',
                borderRadius:'8px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <div style={{ flexGrow: 1 }} /> 
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <img src={logo} alt="Expense Tracker Logo" style={{ fontFamily: 'Nunito Sans', width: '120px', marginRight: '20px' }} />
            </div>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {navigationItems.map(({ text, icon, link, title, subItems }, index) => (
              <div key={text}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                   component={Link} 
                   to={link}                  
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    onClick={() => subItems && handleExpandClick(index)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, fontSize: '14px', fontWeight: 500, color: 'rgb(18, 25, 38)' }} />
                    {subItems && (open ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                  {open && (
                    <Typography variant="body2" sx={{ ml: 9, fontSize: '12px', color: 'rgb(100, 100, 100)' }}>
                      {title}
                    </Typography>
                  )}
                </ListItem>
                {subItems && (
                  <Collapse in={expandedItems[index]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {subItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding sx={{ display: 'block', pl: 4 }}>
                          <ListItemButton
                            component={Link}  
                            to={subItem.link}                  
                            sx={{
                              minHeight: 48,
                              justifyContent: open ? 'initial' : 'center',
                              px: 2.5,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={subItem.text} sx={{ opacity: open ? 1 : 0, fontSize: '14px', fontWeight: 500, color: 'rgb(18, 25, 38)' }} />
                          </ListItemButton>
                          {open && (
                            <Typography variant="body2" sx={{ ml: 9, fontSize: '12px', color: 'rgb(100, 100, 100)' }}>
                              {subItem.title}
                            </Typography>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>
          <Divider />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 2, backgroundColor: '#eef2f6', }}>
          <DrawerHeader />
          <main style={{
            backgroundColor: 'white',
            minHeight: '81.9vh',
            flexGrow: 1,
            padding: '2%',
            borderRadius: '12px',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 500,
            lineHeight: 1.3,
            boxSizing: 'border-box',
          }}>
            <ToastContainer />
            {children}
          </main>
          <Footer />
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
