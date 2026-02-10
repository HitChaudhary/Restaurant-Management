import express from 'express';
import { getDashboardStats, loginUser } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginUser)
adminRouter.get('/stats', getDashboardStats);

export default adminRouter ;