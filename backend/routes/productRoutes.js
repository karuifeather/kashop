import express from 'express';

import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProduct,
  getProducts,
  getTopProducts,
  updateProduct,
} from '../controllers/productController.js';

import { protect, restrictToAdmin } from '../controllers/authController.js';

const router = express.Router();

router.get('/top', getTopProducts);

router
  .route('/')
  .get(getProducts)
  .post(protect, restrictToAdmin, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .delete(protect, restrictToAdmin, deleteProduct)
  .patch(protect, restrictToAdmin, updateProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
