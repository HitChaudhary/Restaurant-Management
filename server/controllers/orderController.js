import Order from '../models/order.js';

// Save or update an in-progress order
export const saveOrder = async (req, res) => {
  try {
    const { tableNumber, items, subtotal } = req.body;
    if (!tableNumber || !items?.length) {
      return res.status(400).json({ success: false, message: 'tableNumber and items are required' });
    }

    let order = await Order.findOne({ tableNumber, status: 'In-Progress' });
    if (order) {
      order.items    = items;
      order.subtotal = subtotal;
      await order.save();
    } else {
      order = await Order.create({ tableNumber, items, subtotal });
    }
    res.json({ success: true, message: 'Order saved', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active (In-Progress) orders
export const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'In-Progress' }).sort({ createdAt: 1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Finalize (complete + bill) an order
export const finalizeOrder = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { tax, totalAmount, paymentMethod } = req.body;

    const order = await Order.findOneAndUpdate(
      { tableNumber, status: 'In-Progress' },
      { tax, totalAmount, paymentMethod, status: 'Completed' },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'No active order for this table' });
    res.json({ success: true, message: 'Order finalized', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get order history
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
