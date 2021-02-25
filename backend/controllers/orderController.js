import Order from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items given.', 400));
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });

  const createdOrder = await order.save();

  res.status(201).json({
    status: 'success',
    data: { order: createdOrder },
  });
});

// @desc    get order by ID
// @route   POST /api/v1/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

// @desc    Update order to paid
// @route   POST /api/v1/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now() - 2000;
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.status(202).json({
    status: 'success',
    data: { order: updatedOrder },
  });
});
