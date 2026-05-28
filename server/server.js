import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';

// Routes
import adminRoutes  from './routes/adminRoutes.js';
import menuRoutes   from './routes/menuRoutes.js';
import orderRoutes  from './routes/orderRoutes.js';
import cafeRoutes   from './routes/cafeRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
// Restaurant
app.use('/api/admin',  adminRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/order',  orderRoutes);

// Cafe
app.use('/api/cafe',   cafeRoutes);

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
