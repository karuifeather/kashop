import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
};

// @desc    Fetch product by ID
// @route   /api/v1/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
};
