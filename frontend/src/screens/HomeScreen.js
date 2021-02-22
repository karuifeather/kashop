import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import products from '../apis/products';
import Product from '../components/Product';

const HomeScreen = () => {
  const [productItems, setProductItems] = useState([]);

  useEffect(() => {
    const makeTheReq = async () => {
      const { data } = await products.get();

      setProductItems(data.data.products);
    };

    makeTheReq();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {productItems.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
