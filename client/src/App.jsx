import { Routes, Route, Navigate } from 'react-router-dom';
import { useHotelcontext } from './Context/HotelContext';

// Auth
import Login from './Pages/Auth/Login';

// Restaurant — Staff
import Tables    from './Pages/Staff/Tables';
import TakeOrder from './Pages/Staff/TakeOrder';
import BillGenration from './Pages/Staff/BillGenration';

// Restaurant — Admin
import Layout   from './Pages/Admin/Layout';
import Dashboard from './Pages/Admin/Dashboard';
import MenuList  from './Pages/Admin/MenuList';
import AddItem   from './Pages/Admin/AddItem';

// Cafe — Customer
import Cafeteria from './Pages/Cafe/Cafeteria';
// Cafe — Kitchen staff
import Kitchen   from './Pages/Cafe/Kitchen';

// Guards
const StaffRoute  = ({ children }) => {
  const { token } = useHotelcontext();
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, role } = useHotelcontext();
  return token && role === 'admin' ? children : <Navigate to="/login" replace />;
};

const KitchenRoute = ({ children }) => {
  const { token } = useHotelcontext();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login"      element={<Login />} />
    <Route path="/cafeteria"  element={<Cafeteria />} />       {/* customer self-order, no auth */}

    {/* Restaurant Staff */}
    <Route path="/staff"               element={<StaffRoute><Tables /></StaffRoute>} />
    <Route path="/staff/order/:tableId" element={<StaffRoute><TakeOrder /></StaffRoute>} />
    <Route path="/staff/bill/:tableId"  element={<StaffRoute><BillGenration /></StaffRoute>} />

    {/* Cafe Kitchen — staff only */}
    <Route path="/kitchen" element={<KitchenRoute><Kitchen /></KitchenRoute>} />

    {/* Admin */}
    <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
      <Route index           element={<Dashboard />} />
      <Route path="menulist" element={<MenuList />} />
      <Route path="additem"  element={<AddItem />} />
    </Route>

    {/* Default */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
