import React, { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import Layout from '../components/Layout';
import { useStyles } from '../utils/styles';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../components/Store';
import { Alert } from '@material-ui/lab';

function Payment() {
  const classes = useStyles();
  const [error, setError] = useState('');
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      Router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Please Select Payment Method');
    } else {
      dispatch({
        type: 'CART_SAVE_PAYMENT',
        payload: paymentMethod,
      });
      Cookies.set('paymentMethod', paymentMethod);
      Router.push('/placeorder');
    }
  };

  return (
    <Layout title="Shipping">
      <CheckoutSteps activeStep={3}></CheckoutSteps>
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h2" variant="h2">
          Payment Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Payment"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label="Paypal"
            />
            <FormControlLabel
              value="stripe"
              control={<Radio />}
              label="Stripe"
            />
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          </RadioGroup>
        </FormControl>
        <Box className={classes.submitButton}>
          <Button
            type="button"
            variant="contained"
            color="default"
            onClick={() => Router.push('/shipping')}
          >
            Back
          </Button>{' '}
          <Button type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Payment), {
  ssr: false,
});
