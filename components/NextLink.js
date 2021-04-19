import { Link } from '@material-ui/core';
import NxLink from 'next/link';
import React from 'react';

export default function NextLink({ href, children }) {
  return (
    <NxLink href={href}>
      <Link href={href}>{children}</Link>
    </NxLink>
  );
}
