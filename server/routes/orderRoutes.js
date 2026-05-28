import express from 'express';
import { saveOrder, getActiveOrders, finalizeOrder, getOrderHistory } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/save',              authMiddleware, saveOrder);
router.get('/active',            authMiddleware, getActiveOrders);
router.patch('/finalize/:tableNumber', authMiddleware, finalizeOrder);
router.get('/history',           authMiddleware, getOrderHistory);

export default router;
