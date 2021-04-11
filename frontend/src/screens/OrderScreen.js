import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Row, Col, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, deliverOrder } from '../actions/orderActions';
import { ORDER_DELIVER_RESET } from '../actions/types';

const OrderScreen = ({ match, stripe, location, history }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  // const paid = location.search.split('=')[1];

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { userInfo } = useSelector((state) => state.loggedinUser);
  const { loading: dLoading, error: dError, success: dSuccess } = useSelector(
    (state) => state.deliverOrder
  );

  if (!loading && !error) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  useEffect(() => {
    if (!userInfo) history.push('/login');

    if (!order || orderId !== order._id) dispatch(getOrderDetails(orderId));

    if (dSuccess) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }

    // TODO: Remove this logic in production
    // no need to do it manually: stripe does it for us
    // if (Boolean(paid)) {
    //   axios.get(`/api/v1/orders/pay/${orderId}`);

    //   dispatch(getOrderDetails(orderId));
    //   history.push(`/order/${orderId}`);
    // }
    // eslint-disable-next-line
  }, [dispatch, orderId, dSuccess]);

  const onPayClick = () => {
    async function createCheckout() {
      const { data } = await axios.get(`/api/v1/orders/checkout/${orderId}`);

      stripe.redirectToCheckout({ sessionId: data.session.id });
    }

    createCheckout();
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user && order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user && order.user.email}`}>
                  {order.user && order.user.email}
                </a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your order is empty</Message>
              ) : (
                <ListGroup>
                  {order.orderItems.map((item) => {
                    return (
                      <ListGroup.Item key={item.product}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.quantity} x {item.price} = $
                            {(item.quantity * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={order.isPaid || !stripe}
                      onClick={onPayClick}
                      variant='primary'
                    >
                      Pay now
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
              {dLoading && <Loader />}
              {dError && <Message variant='danger'>{dError}</Message>}
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={!order.isPaid || order.isDelivered}
                    onClick={deliverHandler}
                    variant='primary'
                  >
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const stripePromise = loadStripe(
  'pk_test_51IM7NgEKp6LlVHgD0RCRi4BDPqBtRFRH73z4ETvDtFISXc7X0to0ukX8LkYVlYkrkSvMtiILZQTvsQRZOLJi9thB00kKshOOZz'
);

const InjectedCheckoutForm = ({ match, location, history }) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <OrderScreen
          match={match}
          stripe={stripe}
          location={location}
          history={history}
        />
      )}
    </ElementsConsumer>
  );
};

const StripeWrapper = ({ match, location, history }) => {
  return (
    <Elements stripe={stripePromise}>
      <InjectedCheckoutForm
        match={match}
        location={location}
        history={history}
      />
    </Elements>
  );
};

export default StripeWrapper;
