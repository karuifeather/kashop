import express from 'express';

import { protect, restrictToAdmin } from '../controllers/authController.js';
import {
  addOrderItems,
  getOrder,
  getCheckoutSession,
  updateOrderToPaidTest,
  getOrders,
  getAllOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/', protect, restrictToAdmin, getAllOrders);
router.get('/myorders', protect, getOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id', protect, restrictToAdmin, updateOrderToDelivered);
router.get('/checkout/:orderId', getCheckoutSession);

// FOR TESTing only!! DISABLE THIS ROUTE IN PRODUCTION!!
// router.get('/pay/:orderId', updateOrderToPaidTest);

export default router;
