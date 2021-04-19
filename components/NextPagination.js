/* eslint-disable react/display-name */
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';

export default function NextPagination({ className, totalPages, prefix }) {
  const { query } = useRouter();
  const p = typeof prefix === 'function' ? prefix({}) : prefix;
  return (
    <Pagination
      className={className}
      page={parseInt(query.page || '1')}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          query={query}
          item={item}
          component={NextLink}
          {...item}
        ></PaginationItem>
      )}
    ></Pagination>
  );
}

const NextLink = forwardRef(({ item, query, prefix, ...props }, ref) => (
  <Link
    href={{
      pathname: prefix || '/search',
      query: { ...query, page: item.page },
    }}
    {...props}
  >
    <a {...props} ref={ref}></a>
  </Link>
));
