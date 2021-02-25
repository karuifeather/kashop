import express from 'express';

import { protect } from '../controllers/authController.js';
import { addOrderItems } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, addOrderItems);

export default router;
