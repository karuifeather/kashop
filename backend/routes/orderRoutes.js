import express from 'express';

import { protect } from '../controllers/authController.js';
import {
  addOrderItems,
  getOrder,
  updateOrderToPaid,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/:id', protect, getOrder);
router.patch('/:id/pay', protect, updateOrderToPaid);

export default router;
