const stripe = require('stripe')(process.env.STRIPE_SECRET);
import Order from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

exports.getCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  // 1. Get the tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
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

const updateOrderToPaid = (sessionData) => {
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
// @route   POST /webhook-checkout
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
    updateOrderToPaid(event.data.object);
  }

  res.status(200).json({ received: true });
};
