import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Row, Col, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrderCheckout } from '../actions/orderActions';

const OrderScreen = ({ match, stripe }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { session } = useSelector((state) => state.orderPaidStatus);

  if (!loading) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  useEffect(() => {
    if (!order) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order]);

  const onPayClick = () => {
    dispatch(payOrderCheckout(orderId));

    stripe.redirectToCheckout({ sessionId: session.id });
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
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
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>Paid on{order.deliveredAt}</Message>
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
                <Message variant='success'>Paid on{order.paidAt}</Message>
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
                      disabled={!stripe}
                      onClick={onPayClick}
                      variant='primary'
                    >
                      Pay now
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
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

const InjectedCheckoutForm = ({ match }) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => <OrderScreen match={match} stripe={stripe} />}
    </ElementsConsumer>
  );
};

const StripeWrapper = ({ match }) => {
  return (
    <Elements stripe={stripePromise}>
      <InjectedCheckoutForm match={match} />
    </Elements>
  );
};

export default StripeWrapper;
