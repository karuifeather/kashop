import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

// @desc    Create new order
// @route   GET /api/v1/orders/checkout/:orderID
// @access  Public
export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  // 1. Get the tour
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('user', 'email');

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `https://${req.get('host')}/order/${orderId}`,
    cancel_url: `https://${req.get('host')}/`,
    customer_email: order.user.email,
    client_reference_id: req.params.orderId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Items from your cart.' },
          unit_amount_decimal: order.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3. Create chekout session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

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

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
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

const updateOrderToPaid = async (sessionData) => {
  const order = await Order.findById(sessionData.client_reference_id);

  order.isPaid = true;
  order.paidAt = Date.now() - 2000;

  await order.save();
};

// Use in development only
export const updateOrderToPaidTest = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now() - 2000;
  const updatedOrder = await order.save();

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrder },
  });
});

// @desc    Update order to paid
// @route   POST {ROOT}/webhook-checkout
// @access  By Stripe API
export const webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  console.log(signature);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    // to Stripe
    console.log(e);
    return res.status(400).send(`Webhook error: ${e}`);
  }

  if (event.type === 'checkout.session.completed') {
    updateOrderToPaid(event.data.object).catch((e) =>
      console.log('UPDATE TO PAID ERROR'.bgRed.bold, e)
    );
  }

  res.status(200).json({ received: true });
};

// @desc    Get logged-in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

// @desc    Get orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name ');

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

// @desc    Update order to delivered
// @route   PATCH /api/v1/orders/:id
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now() - 2000;
  const updatedOrder = await order.save();

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrder },
  });
});
