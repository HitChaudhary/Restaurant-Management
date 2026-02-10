import jwt from 'jsonwebtoken';
import Order from '../models/order.js';


export const loginUser = async (req, res) => {
    try {
        const { userId, password, role } = req.body;

        // 1. Logic for ADMIN
        if (role === 'admin') {
            if (userId === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.json({ success: true, token, role: 'admin', name: "Hit Chaudhary" });
            }
        }

        // 2. Logic for STAFF
        if (role === 'staff') {
            if (userId === process.env.STAFF_USERNAME && password === process.env.STAFF_PASSWORD) {
                const token = jwt.sign({ role: 'staff' }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.json({ success: true, token, role: 'staff', name: "Kitchen Staff" });
            }
        }

        // 3. If neither matches
        return res.json({ success: false, message: "Invalid ID or Password for the selected role" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Stats (Revenue & Count)
        const overallStats = await Order.aggregate([
            { $match: { status: "Completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // 2. Daily Orders (Simple Count)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        // --- NEW SIMPLE LOGIC: Payment Split ---
        // We group by 'paymentMethod' to see: { _id: "Cash", total: 5000 }, { _id: "UPI", total: 8000 }
        const paymentStats = await Order.aggregate([
            { $match: { status: "Completed" } },
            {
                $group: {
                    _id: "$paymentMethod", 
                    amount: { $sum: "$totalAmount" }
                }
            }
        ]);

        // 3. Best Sellers (Keep as is)
        const bestSellers = await Order.aggregate([
            { $match: { status: "Completed" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    count: { $sum: "$items.qty" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 4 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue: overallStats[0]?.totalRevenue || 0,
                totalOrders: overallStats[0]?.totalOrders || 0,
                todayOrders: todayOrders,
            },
            paymentStats, // <--- Sending this to frontend
            topItems: bestSellers
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
};