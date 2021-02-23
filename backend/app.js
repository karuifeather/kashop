import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import productRouter from './routes/productRoutes.js';

dotenv.config();
const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));


app.use('/api/v1/products', productRouter);

export default app;
