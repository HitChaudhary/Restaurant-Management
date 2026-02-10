import express from 'express';
import { 
    saveOrder, 
    getActiveOrders, 
    finalizeOrder 
} from '../controllers/orderController.js';

const router = express.Router();


router.get('/active', getActiveOrders);
router.post('/save', saveOrder);
router.put('/finalize', finalizeOrder);

export default router;