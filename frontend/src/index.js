import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './bootstrap.min.css';
import './index.css';
import App from './App';
import reducers from './reducers';

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
const initialState = { cart: { cartItems }, loggedinUser: { userInfo } };

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
