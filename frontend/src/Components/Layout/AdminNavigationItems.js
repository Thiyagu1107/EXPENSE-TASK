import React from 'react';
import { Dashboard, Assessment } from '@mui/icons-material';

const adminNavigationItems = [
  {
    text: 'Dashboard',
    title: 'Home Dashboard',
    icon: <Dashboard />,
    link: '/dashboard/admin',
  },
  {
    text: 'Expense',
    title: 'Expense Management',
    icon: <Assessment />,
    link: '/dashboard/admin/expense',
  },

];

export default adminNavigationItems;
