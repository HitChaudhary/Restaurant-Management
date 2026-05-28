import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CafeContext = createContext();

export const CafeContextProvider = ({ children }) => {
  const [cafeOrders, setCafeOrders]   = useState([]);
  const [cafeMenu, setCafeMenu]       = useState([]);
  const [cafeLoading, setCafeLoading] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  // ─── Fetch cafe menu from DB ──────────────────────────────
  const fetchCafeMenu = async () => {
    try {
      const { data } = await axios.get('/api/menu?section=cafe');
      if (data.success) setCafeMenu(data.dishes);
    } catch (err) {
      console.error('fetchCafeMenu:', err.message);
    }
  };

  // ─── Place a new cafe order (public — no auth) ────────────
  const placeCafeOrder = async (items, subtotal, paymentMethod = 'Cash') => {
    setCafeLoading(true);
    try {
      const { data } = await axios.post('/api/cafe/order', { items, subtotal, paymentMethod });
      if (data.success) {
        toast.success(`Order placed! Token: ${data.order.orderToken}`);
        return { success: true, order: data.order };
      }
      toast.error(data.message);
      return { success: false };
    } catch {
      toast.error('Could not place order');
      return { success: false };
    } finally {
      setCafeLoading(false);
    }
  };

  // ─── Kitchen: fetch pending/active orders ─────────────────
  const fetchCafeOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/cafe/orders', authHeader());
      if (data.success) setCafeOrders(data.orders);
    } catch (err) {
      console.error('fetchCafeOrders:', err.message);
    }
  };

  // ─── Update order status ──────────────────────────────────
  const updateCafeStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`/api/cafe/order/${id}/status`, { status }, authHeader());
      if (data.success) {
        toast.success(`Status → ${status}`);
        await fetchCafeOrders();
      }
    } catch {
      toast.error('Could not update status');
    }
  };

  // ─── Mark cafe order paid & complete ─────────────────────
  const markCafePaid = async (id, paymentMethod) => {
    try {
      const { data } = await axios.patch(`/api/cafe/order/${id}/pay`, { paymentMethod }, authHeader());
      if (data.success) {
        toast.success('Payment recorded');
        await fetchCafeOrders();
      }
    } catch {
      toast.error('Could not record payment');
    }
  };

  // ─── Cancel order ─────────────────────────────────────────
  const cancelCafeOrder = async (id) => {
    try {
      await axios.delete(`/api/cafe/order/${id}`, authHeader());
      toast.success('Order cancelled');
      await fetchCafeOrders();
    } catch {
      toast.error('Could not cancel order');
    }
  };

  // Auto-refresh kitchen every 10s
  useEffect(() => {
    fetchCafeMenu();
    if (token) {
      fetchCafeOrders();
      const interval = setInterval(fetchCafeOrders, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <CafeContext.Provider value={{
      cafeMenu, cafeOrders, cafeLoading,
      fetchCafeMenu, placeCafeOrder, fetchCafeOrders,
      updateCafeStatus, markCafePaid, cancelCafeOrder,
    }}>
      {children}
    </CafeContext.Provider>
  );
};

export const useCafeContext = () => useContext(CafeContext);
