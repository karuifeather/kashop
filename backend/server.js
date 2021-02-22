const express = require('express');
const products = require('./data/products');

const app = express();

const port = process.env.PORT || 4000;

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

app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
