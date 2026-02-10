import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useHotelcontext } from './Context/HotelContext';

// Pages
import Home from './Pages/Home';
import LoginPage from './components/Login';
import TableDashboard from './Pages/Staff/Tables';
import OrderLayout from './Pages/Staff/TakeOrder';
import FinalBillModal from './Pages/Staff/BillGenration';
import Layout from './Pages/Admin/Layout';
import Dashboard from './Pages/Admin/Dashboard';
import AdminMenuList from './Pages/Admin/MenuList';
import AddItem from './Pages/Admin/AddItem';

const App = () => {
  const { token } = useHotelcontext();
  const role = localStorage.getItem('role'); // Get role to check access levels

  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={token ? <Navigate to={role === 'admin' ? '/admin' : '/staff'} /> : <LoginPage />} />

      {/* Staff Routes - Only accessible if token exists */}
      <Route path='/staff'>
        <Route index element={token ? <TableDashboard /> : <Navigate to="/login" />} />
        <Route path="takeorder/:tableId" element={token ? <OrderLayout /> : <Navigate to="/login" />} />
        <Route path="bill/:tableId" element={token ? <FinalBillModal /> : <Navigate to="/login" />} />
      </Route>

      {/* Admin Routes - Only accessible if token exists AND role is admin */}
      <Route path='/admin' element={token && role === 'admin' ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path='menulist' element={<AdminMenuList />} />
        <Route path='additem' element={<AddItem />} />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;