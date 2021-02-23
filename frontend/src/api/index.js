import axios from 'axios';

export const products = axios.create({
  baseURL: '/api/v1/products',
});
