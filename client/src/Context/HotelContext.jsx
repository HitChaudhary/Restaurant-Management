import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Base URL from env — falls back to same-origin (Vite proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const HotelContext = createContext();

export const HotelContextProvider = ({ children }) => {
  const [token, setToken]           = useState(localStorage.getItem('token') || '');
  const [role, setRole]             = useState(localStorage.getItem('role')  || '');
  const [activeTables, setActiveTables] = useState([]);
  const [dishes, setDishes]         = useState([]);
  const [loading, setLoading]       = useState(false);

  // Auth header helper
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  // ─── Login ────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/api/admin/login', { username, password });
      if (data.success) {
        setToken(data.token);
        setRole(data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        toast.success('Logged in');
        return { success: true, role: data.role };
      }
      toast.error(data.message || 'Login failed');
      return { success: false };
    } catch {
      toast.error('Server error');
      return { success: false };
    }
  };

  // ─── Logout ───────────────────────────────────────────────
  const logout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Logged out');
  };

  // ─── Fetch active restaurant tables ───────────────────────
  const fetchActiveTables = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/order/active', authHeader());
      if (data.success) setActiveTables(data.orders);
    } catch (err) {
      console.error('fetchActiveTables:', err.message);
    }
  };

  // ─── Fetch restaurant menu from DB ────────────────────────
  const fetchRestaurantMenu = async () => {
    try {
      const { data } = await axios.get('/api/menu?section=restaurant');
      if (data.success) setDishes(data.dishes);
    } catch (err) {
      console.error('fetchRestaurantMenu:', err.message);
    }
  };

  // ─── Save / update order ──────────────────────────────────
  const saveOrder = async (tableNumber, items, subtotal) => {
    try {
      const { data } = await axios.post('/api/order/save', { tableNumber, items, subtotal }, authHeader());
      if (data.success) {
        toast.success('Order saved');
        await fetchActiveTables();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch {
      toast.error('Could not save order');
      return false;
    }
  };

  // ─── Finalize order (billing) ─────────────────────────────
  const finalizeOrder = async (tableNumber, finalData) => {
    try {
      const { data } = await axios.patch(`/api/order/finalize/${tableNumber}`, finalData, authHeader());
      if (data.success) {
        toast.success('Order finalized');
        await fetchActiveTables();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch {
      toast.error('Could not finalize order');
      return false;
    }
  };

  // ─── Add new dish (admin) ─────────────────────────────────
  const addNewDish = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/menu/add', formData, authHeader());
      if (data.success) {
        toast.success('Dish added');
        await fetchRestaurantMenu();
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Remove dish (admin) ──────────────────────────────────
  const removeDish = async (id) => {
    try {
      const { data } = await axios.delete(`/api/menu/${id}`, authHeader());
      if (data.success) {
        toast.success('Dish removed');
        await fetchRestaurantMenu();
      }
    } catch {
      toast.error('Could not remove dish');
    }
  };

  // Auto-refresh active tables every 15s when logged in
  useEffect(() => {
    if (!token) return;
    fetchActiveTables();
    fetchRestaurantMenu();
    const interval = setInterval(fetchActiveTables, 15000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <HotelContext.Provider value={{
      token, role, activeTables, dishes, loading,
      login, logout, saveOrder, finalizeOrder, addNewDish, removeDish,
      fetchActiveTables, fetchRestaurantMenu,
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelcontext = () => useContext(HotelContext);
