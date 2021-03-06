import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { login } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = location.search.split('=')[1] || '/';

  const dispatch = useDispatch();

  const { loading, userInfo, error } = useSelector(
    (state) => state.loggedinUser
  );

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, redirect, history]);

  const onFormSubmit = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={onFormSubmit}>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='jane@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='**********'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Log in
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
