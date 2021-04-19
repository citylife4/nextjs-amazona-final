import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { siteName } from '../utils/config';

function Footer() {
  return (
    <Box display="flex" justifyContent="center">
      <Typography>All rights reserved. {siteName} ©2021</Typography>
    </Box>
  );
}

export default Footer;
