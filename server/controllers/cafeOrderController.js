import CafeOrder from '../models/cafeOrder.js';

// Counter for generating order tokens per day
let dailyCounter = 0;
let lastDate = '';

const generateToken = () => {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastDate) { dailyCounter = 0; lastDate = today; }
  dailyCounter++;
  return `C-${String(dailyCounter).padStart(3, '0')}`;
};

// POST /api/cafe/order — create new cafe order
export const createCafeOrder = async (req, res) => {
  try {
    const { items, subtotal, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'items are required' });

    const tax         = subtotal * 0.05;          // 5% GST for cafe
    const totalAmount = Math.round(subtotal + tax);
    const orderToken  = generateToken();

    const order = await CafeOrder.create({ orderToken, items, subtotal, totalAmount, paymentMethod: paymentMethod || 'Cash' });
    res.status(201).json({ success: true, message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cafe/orders — kitchen view (all non-completed)
export const getCafeOrders = async (req, res) => {
  try {
    const orders = await CafeOrder.find({ status: { $ne: 'Completed' } }).sort({ createdAt: 1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/cafe/order/:id/status — update status
export const updateCafeOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await CafeOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/cafe/order/:id/pay — mark payment
export const markCafePaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await CafeOrder.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'Paid', paymentMethod, status: 'Completed' },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/cafe/order/:id — cancel
export const cancelCafeOrder = async (req, res) => {
  try {
    await CafeOrder.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
