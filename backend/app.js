import morgan from 'morgan';
import products from './data/products.js';
import express from 'express';

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'API running',
  });
});

app.get('/api/v1/products', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

app.get('/api/v1/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export default app;
