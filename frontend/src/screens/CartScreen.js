import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Form,
  Image,
  Card,
  Button,
} from 'react-bootstrap';

import { addToCart, removeFromCart } from '../actions/cartAction';
import Message from '../components/Message';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;

  const qty = Number(location.search.split('=')[1]) || 1;

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [productId, qty, dispatch]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const renderItems = (items) => {
    return items.map((item) => (
      <ListGroup.Item key={item.product}>
        <Row>
          <Col md={2}>
            <Image src={item.image} fluid rounded />
          </Col>
          <Col>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
          </Col>
          <Col md={2}>${item.price}</Col>
          <Col md={2}>
            <Form.Control
              as='select'
              value={item.quantity}
              onChange={(e) =>
                dispatch(addToCart(item.product, e.target.value * 1))
              }
            >
              {[...Array(item.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md={2}>
            <Button
              type='button'
              variant='light'
              onClick={() => removeFromCartHandler(item.product)}
            >
              <i className='fas fa-trash'></i>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
    ));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>{renderItems(cartItems)}</ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>
                Subtotal (
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items
              </h3>
              $
              {cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                className='btn-block'
                type='button'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
