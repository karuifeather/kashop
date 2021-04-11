import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          let link;

          if (!isAdmin) {
            if (keyword) link = `/search/${keyword}/page/${x + 1}`;
            else link = `/page/${x + 1}`;
          } else link = `/admin/productList/page/${x + 1}`;

          return (
            <LinkContainer key={x + 1} to={link}>
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;
