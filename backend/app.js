import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './controllers/errorHandler.js';

dotenv.config();
const app = express();

app.use(express.json());
// Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
