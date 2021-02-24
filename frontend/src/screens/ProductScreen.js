import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';

import { getProduct } from '../actions/productActions';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = ({ match, history }) => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const currentProduct = useSelector((state) => state.currentProduct);
  const { loading, error, item } = currentProduct;

  useEffect(() => {
    dispatch(getProduct(match.params.id));
  }, [dispatch, match]);

  const addToCart = () => {
    history.push(`/cart/${match.params.id}?qty=${quantity}`);
  };

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={item.image} alt={item.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{item.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={item.rating}
                  text={`${item.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${item.price}</ListGroup.Item>
              <ListGroup.Item>{item.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${item.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {item.countInStock > 0 ? 'In stock' : 'Out of stock'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {item.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCart}
                    className='btn-block'
                    type='button'
                    disabled={item.countInStock === 0}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
