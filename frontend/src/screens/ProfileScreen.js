import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { getUserProfile, updateUserProfile } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const { loading, user, error } = useSelector((state) => state.userDetails);

  const { userInfo } = useSelector((state) => state.loggedinUser);

  const { success } = useSelector((state) => state.updatedUserProfile);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserProfile('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, history, dispatch, user]);

  const onFormSubmit = (e) => {
    e.preventDefault();

    dispatch(updateUserProfile({ name, email }));
  };

  return (
    <Row>
      <Col md={3}>
        <h1>User Profile</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {success && (
          <Message variant='success'>
            Your data has been succesfully updated.
          </Message>
        )}
        {loading && <Loader />}
        <Form onSubmit={onFormSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Jane Doe'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='jane@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
