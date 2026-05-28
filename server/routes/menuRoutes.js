import express from 'express';
import { getAllDishes, addDish, removeDish, toggleAvailability } from '../controllers/menuController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDishes);                                    // public
router.post('/add', authMiddleware, addDish);                    // admin only
router.delete('/:id', authMiddleware, removeDish);               // admin only
router.patch('/:id/toggle', authMiddleware, toggleAvailability); // admin only

export default router;
