import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className='bg-primary'>
      <Container>
        <Row>
          <Col className='text-center py-3 text-light'>
            Copyright &copy; {new Date().getFullYear()} mYsHOP
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
