import express from 'express';

import { protect } from '../controllers/authController.js';
import { addOrderItems, getOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/:id', protect, getOrder);

export default router;
