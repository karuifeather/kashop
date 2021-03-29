import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

/**
 * {
[0]   shippingAddress: {
[0]     address: 'Manakamana Margh',
[0]     city: 'Kathmandu',
[0]     postalCode: '44600',
[0]     country: 'Nepal'
[0]   },
[0]   taxPrice: 632.97,
[0]   shippingPrice: 0,
[0]   totalPrice: 4852.79,
[0]   isPaid: false,
[0]   isDelivered: false,
[0]   _id: 6061dafee77dc4357814d734,
[0]   orderItems: [
[0]     {
[0]       _id: 6061dafee77dc4357814d735,
[0]       product: 60339c4207c52e2a70397f6d,
[0]       name: 'iPhone 11 Pro 256GB Memory',
[0]       image: '/images/phone.jpg',
[0]       price: 599.99,
[0]       quantity: 4
[0]     },
[0]     {
[0]       _id: 6061dafee77dc4357814d736,
[0]       product: 60339c4207c52e2a70397f70,
[0]       name: 'Logitech G-Series Gaming Mouse',
[0]       image: '/images/mouse.jpg',
[0]       price: 49.99,
[0]       quantity: 7
[0]     },
[0]     {
[0]       _id: 6061dafee77dc4357814d737,
[0]       product: 60339c4207c52e2a70397f6c,
[0]       name: 'Airpods Wireless Bluetooth Headphones',
[0]       image: '/images/airpods.jpg',
[0]       price: 89.99,
[0]       quantity: 6
[0]     },
[0]     {
[0]       _id: 6061dafee77dc4357814d738,
[0]       product: 60339c4207c52e2a70397f6e,
[0]       name: 'Cannon EOS 80D DSLR Camera',
[0]       image: '/images/camera.jpg',
[0]       price: 929.99,
[0]       quantity: 1
[0]     }
[0]   ],
[0]   paymentMethod: 'Stripe',
[0]   user: 6061ae2b2f4f01194c5a2b2a,
[0]   createdAt: 2021-03-29T13:49:50.628Z,
[0]   updatedAt: 2021-03-29T13:49:50.628Z,
[0]   __v: 0
[0] }
 */

/**You did not provide an API key. You need to provide your API key in the Authorization header, using Bearer auth (e.g. 'Authorization: Bearer YOUR_SECRET_KEY'). See https://stripe.com/docs/api#authentication for details, or we can help at https://support.stripe.com/. */

// @desc    Create new order
// @route   GET /api/v1/orders/checkout/:orderID
// @access  Public
export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  // 1. Get the tour
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('user', 'email');
  console.log(order);

  // order.orderItems.forEach()

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://127.0.0.1:3000/order/${orderId}?paid=true`,
    cancel_url: `http://127.0.0.1:3000/order/${orderId}`,
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

  console.log(session);

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

const updateOrderToPaid = async (sessionData) => {
  const order = await Order.findById(sessionData.client_reference_id);

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now() - 2000;
  order.paymentResult = {
    id: sessionData.client_reference_id,
    status: sessionData.client_reference_id,
    update_time: sessionData.update_time,
    email_address: sessionData.customer_details.email,
  };

  return await order.save();

  // res.status(202).json({
  //   status: 'success',
  //   data: { order: updatedOrder },
  // });
};

// @desc    Update order to paid
// @route   POST {ROOT}/webhook-checkout
// @access  By Stripe API
export const webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // event = JSON.parse(req.body);
  } catch (e) {
    // to Stripe
    return res.status(400).send(`Webhook error: ${e}`);
  }

  if (event.type === 'checkout.session.completed') {
    updateOrderToPaid(event.data.object).catch((e) =>
      console.log('UPDATE TO PAID ERROR'.bgRed.bold, e)
    );
  }

  res.status(200).json({ received: true });
};
