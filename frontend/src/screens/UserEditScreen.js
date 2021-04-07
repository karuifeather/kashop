import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { getUserProfile, updateUser } from '../actions/userActions';
import { USER_UPDATE_BY_ADMIN_RESET } from '../actions/types';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const { loading, user, error } = useSelector((state) => state.userDetails);
  const {
    loading: updateLoading,
    success: successUpdate,
    error: updateError,
  } = useSelector((state) => state.userUpdateByAdmin);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_BY_ADMIN_RESET });
      history.push('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserProfile(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, dispatch, userId, successUpdate, history]);

  const onFormSubmit = (e) => {
    e.preventDefault();

    dispatch(updateUser({ ...user, name, email, isAdmin }));
  };

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go back
      </Link>
      <FormContainer>
        <h1>Update User Info</h1>
        {updateLoading && <Loader />}
        {updateError && <Message variant='danger'>{updateError}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={onFormSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Jane Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='jane@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Admin or not'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
