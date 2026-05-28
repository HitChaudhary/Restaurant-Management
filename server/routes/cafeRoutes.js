import express from 'express';
import {
  createCafeOrder,
  getCafeOrders,
  updateCafeOrderStatus,
  markCafePaid,
  cancelCafeOrder
} from '../controllers/cafeOrderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/order',                  createCafeOrder);               // public — customer self-order
router.get('/orders',                  authMiddleware, getCafeOrders); // kitchen staff
router.patch('/order/:id/status',      authMiddleware, updateCafeOrderStatus);
router.patch('/order/:id/pay',         authMiddleware, markCafePaid);
router.delete('/order/:id',            authMiddleware, cancelCafeOrder);

export default router;
