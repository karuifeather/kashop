import express from 'express';

import { protect } from '../controllers/authController.js';
import {
  addOrderItems,
  getOrder,
  getCheckoutSession,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/:id', protect, getOrder);
router.get('/checkout/:orderId', getCheckoutSession);

export default router;
