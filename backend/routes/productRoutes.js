import express from 'express';

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';

import { protect, restrictToAdmin } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, restrictToAdmin, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .delete(protect, restrictToAdmin, deleteProduct)
  .patch(protect, restrictToAdmin, updateProduct);

export default router;
