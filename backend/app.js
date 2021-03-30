import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { webhookCheckout } from './controllers/orderController.js';
import AppError from './utils/appError.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import globalErrorHandler from './controllers/errorHandler.js';

dotenv.config();
const app = express();

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
