import axios from 'axios';

export const products = axios.create({
  baseURL: '/api/v1/products',
});

export const userLogin = axios.create({
  baseURL: '/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
  },
});
