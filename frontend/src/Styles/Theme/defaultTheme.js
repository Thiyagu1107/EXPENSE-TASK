import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  typography: {
    fontFamily: [
      'Nunito Sans',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // Add other theme configurations as needed
});

export default defaultTheme;
