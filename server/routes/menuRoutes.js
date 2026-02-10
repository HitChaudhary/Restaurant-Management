import express from 'express';
import { addDish, allDish, removeDish } from '../controllers/menuController.js';
import { auth } from '../middleware/auth.js';

const menuRouter = express.Router();

menuRouter.post('/adddish',addDish);
menuRouter.get('/all',auth,allDish)
menuRouter.post('/remove/:id', auth, removeDish);

export default menuRouter;
