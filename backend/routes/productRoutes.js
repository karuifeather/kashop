import express from 'express';

import {
  deleteProduct,
  getProduct,
  getProducts,
} from '../controllers/productController.js';

import { protect, restrictToAdmin } from '../controllers/authController.js';

const router = express.Router();

router.route('/').get(getProducts);

router
  .route('/:id')
  .get(getProduct)
  .delete(protect, restrictToAdmin, deleteProduct);

export default router;
