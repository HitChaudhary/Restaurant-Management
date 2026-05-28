import jwt from 'jsonwebtoken';
import Order from '../models/order.js';
import CafeOrder from '../models/cafeOrder.js';

// ─── Login ──────────────────────────────────────────────────
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token, role: 'admin' });
  }

  if (username === process.env.STAFF_USERNAME && password === process.env.STAFF_PASSWORD) {
    const token = jwt.sign({ username, role: 'staff' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token, role: 'staff' });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
};

// ─── Dashboard Stats (Restaurant + Cafe combined) ───────────
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- RESTAURANT ---
    const restAgg = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } }
    ]);
    const restToday = await Order.countDocuments({ status: 'Completed', createdAt: { $gte: today } });
    const restPayment = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$paymentMethod', amount: { $sum: '$totalAmount' } } }
    ]);
    const restTopItems = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.qty' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // --- CAFE ---
    const cafeAgg = await CafeOrder.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } }
    ]);
    const cafeToday = await CafeOrder.countDocuments({ status: 'Completed', createdAt: { $gte: today } });
    const cafePayment = await CafeOrder.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$paymentMethod', amount: { $sum: '$totalAmount' } } }
    ]);
    const cafeTopItems = await CafeOrder.aggregate([
      { $match: { status: 'Completed' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.qty' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const restRevenue = restAgg[0]?.totalRevenue || 0;
    const cafeRevenue = cafeAgg[0]?.totalRevenue || 0;
    const restOrders  = restAgg[0]?.totalOrders  || 0;
    const cafeOrders  = cafeAgg[0]?.totalOrders  || 0;

    // Merge payment stats
    const paymentMap = {};
    [...restPayment, ...cafePayment].forEach(({ _id, amount }) => {
      paymentMap[_id] = (paymentMap[_id] || 0) + amount;
    });
    const paymentStats = Object.entries(paymentMap).map(([_id, amount]) => ({ _id, amount }));

    res.json({
      success: true,
      stats: {
        totalRevenue:      restRevenue + cafeRevenue,
        restaurantRevenue: restRevenue,
        cafeRevenue,
        totalOrders:       restOrders + cafeOrders,
        restaurantOrders:  restOrders,
        cafeOrders,
        todayOrders:       restToday + cafeToday,
      },
      paymentStats,
      topRestaurantItems: restTopItems,
      topCafeItems:       cafeTopItems,
    });
  } catch (err) {
    console.error('getDashboardStats error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
