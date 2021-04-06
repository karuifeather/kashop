import Product from '../models/productModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Fetch all products
// @route   GET /api/v1/products
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
// @route   GET /api/v1/products/:id
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

// @desc    Delete product by ID
// @route   DELETE /api/v1/products/:id
// @access  Public/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product with that ID can be found.', 404));
  }

  product.remove();

  res.status(204).send();
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Public/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  let product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Desrcription',
  });

  product = await product.save();

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

// @desc    Update product by ID
// @route   PATCH /api/v1/products/:id
// @access  Public/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product) {
    return next(new AppError('No product with that ID can be found.', 404));
  }

  res.status(202).json({
    status: 'success',
    data: { product },
  });
});
