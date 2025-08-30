import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { styled, ThemeProvider } from '@mui/material/styles';
import AdminRoute from './Components/Route/AdminRoute';
import defaultTheme from './Styles/Theme/defaultTheme';





const LoaderWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1301,
  width: '100%'  
});

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>  
);


const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

const Login = Loadable(React.lazy(() => import("./Pages/Auth/Login")));
const AdminDashboard = Loadable(React.lazy(() => import("./Pages/Admin/AdminDashboard")));
const PageNotFound = Loadable(React.lazy(() => import('./Pages/Common/PageNotFound')));
const Expense = Loadable(React.lazy(() => import('./Pages/Admin/ExpenseList')));
const ExpenseADD = Loadable(React.lazy(() => import('./Pages/Admin/AddExpense')));
const Expenseedit = Loadable(React.lazy(() => import('./Pages/Admin/EditExpense')));






function App() {
  return (  
    <>
       <ThemeProvider theme={defaultTheme}>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='*' element={<PageNotFound />} /> 
      
  
    <Route path='/dashboard' element={<AdminRoute />}>
        <Route  path="admin" element={<AdminDashboard />} />
        <Route path="admin/expense" element={< Expense/>} />
        <Route path="admin/expense/create" element={< ExpenseADD/>} />
        <Route path="admin/expense/edit/:id" element={< Expenseedit/>} />


       
      </Route>
      </Routes>
      </ThemeProvider>
      </>
  );
}

export default App;
