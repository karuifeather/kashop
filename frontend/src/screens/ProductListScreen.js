import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import {
  getProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../actions/types';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const {
    success: deleteSuccess,
    loading: deleteLoading,
    error: deleteError,
  } = useSelector((state) => state.deleteProduct);
  const { list, loading, error } = useSelector((state) => state.products);
  const {
    product: createdProduct,
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = useSelector((state) => state.createProduct);
  const { userInfo } = useSelector((state) => state.loggedinUser);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (userInfo && !userInfo.isAdmin) history.push('/login');

    if (createSuccess)
      history.push(`/admin/product/${createdProduct._id}/edit`);

    dispatch(getProducts());
  }, [
    dispatch,
    history,
    userInfo,
    deleteSuccess,
    createSuccess,
    createdProduct,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Hope you know what you're doing!"))
      dispatch(deleteProduct(id));
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {deleteLoading && <Loader />}
      {deleteError && <Message variant='danger'>{deleteError}</Message>}

      {createLoading && <Loader />}
      {createError && <Message variant='danger'>{createError}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
