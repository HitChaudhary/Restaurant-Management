import express from 'express';
import { loginAdmin, getDashboardStats } from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/stats', authMiddleware, getDashboardStats);

export default router;
