import Product from '../models/productModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Fetch all products
// @route   /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

// @desc    Fetch product by ID
// @route   /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product with that ID can be found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});
