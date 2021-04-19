import React, { useContext, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Router from 'next/router';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import { useStyles } from '../utils/styles';
import { getErrorMessage } from '../utils/error';
import CheckoutSteps from '../components/CheckoutSteps';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import NativeSelect from '@material-ui/core/NativeSelect';

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(4, 'Name must be at least 4 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(6, 'Address must be at least 6 characters'),
  city: yup
    .string()
    .required('City is required')
    .min(3, 'City must be at least 3 characters'),
  postalCode: yup
    .string()
    .required('Postal code is required')
    .min(6, 'Postal must be at least 6 digits/charecters'),
  country: yup
    .string()
    .required('Country is required')
    .min(3, 'Country must be at least 3 charecters'),
});

function Shipping() {
  const classes = useStyles();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { userInfo, cart, validAddressList } = state;

  const {
    loading: loadingValidAddress,
    error: errorValidAddress,
    addresses,
    countries,
  } = validAddressList;
  const { shippingAddress, cartItems } = cart;

  const [currentAddressId, setCurrentAddressId] = useState(
    shippingAddress.currentAddressId || ''
  );

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    onSubmit: 'onSubmit',
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!userInfo) {
      Router.push('/signin');
    } else if (cartItems.length === 0) {
      Router.push('/cart');
    } else {
      setValue('fullName', shippingAddress.fullName);
      setValue('address', shippingAddress.address);
      setValue('city', shippingAddress.city);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('country', shippingAddress.country);

      const listValidAddresses = async () => {
        dispatch({ type: 'USER_ADDRESS_VALID_LIST_REQUEST' });

        try {
          const { data } = await axios.get(`/api/users/address/validaddress`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          dispatch({ type: 'USER_ADDRESS_VALID_LIST_SUCCESS', payload: data });
        } catch (error) {
          dispatch({
            type: 'USER_ADDRESS_VALID_LIST_FAIL',
            payload: getErrorMessage(error),
          });
        }
      };

      if (isInitialMount.current) {
        isInitialMount.current = false;
        listValidAddresses();
      }

      if (!loadingValidAddress && addresses) {
        if (shippingAddress.currentAddressId) {
          setCurrentAddressId(shippingAddress.currentAddressId);
        } else {
          setCurrentAddressId(addresses[0]._id);
        }
      }
    }
  }, [addresses, shippingAddress]);

  const submitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    setError('');
    setLoading(true);
    try {
      const {
        data: { lat, lng },
      } = await axios.get(`/api/cities/latlng/${city}`);

      const {
        data: { price },
      } = await axios.get(
        `/api/calculate-shipping?city=${city}&lat=${lat}&lng=${lng}`
      );
      const shippingAddress = {
        fullName,
        address,
        city,
        currentAddressId,
        postalCode,
        country,
        lat,
        lng,
        price: 25,
      };

      dispatch({
        type: 'CART_SAVE_SHIPPING',
        payload: shippingAddress,
      });
      Cookies.set('shippingAddress', JSON.stringify(shippingAddress));
      setLoading(false);
      Router.push('/payment');
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error in processing address';
      setError(message);
      setLoading(false);
    }
  };

  const updateCurrentAddress = (addressId) => {
    const selectedAddress = addresses.find((x) => x._id === addressId);
    setCurrentAddressId(addressId);
    setValue('address', selectedAddress.streetAddress || '');
    setValue('fullName', selectedAddress.fullName || '');
    setValue('city', selectedAddress.city || '');
    setValue('country', selectedAddress.country || '');
    setValue('postalCode', selectedAddress.postalCode || '');
  };

  return (
    <Layout title="Shipping">
      <CheckoutSteps activeStep={2}></CheckoutSteps>

      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h2" variant="h2">
          Shipping Address
        </Typography>

        {loadingValidAddress ? (
          <CircularProgress></CircularProgress>
        ) : errorValidAddress ? (
          <Alert severity="error">{errorValidAddress}</Alert>
        ) : (
          <Box>
            <NativeSelect
              name="current-address"
              fullWidth
              value={currentAddressId}
              onChange={(e) => updateCurrentAddress(e.target.value)}
            >
              {addresses.map((address) => (
                <option
                  key={address._id}
                  value={address._id}
                  id="current-address"
                >
                  {address.streetAddress}
                </option>
              ))}
            </NativeSelect>

            <InputLabel htmlFor="fullName" className={classes.mt1}>
              Full Name
            </InputLabel>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="fullName"
              autoFocus
              InputProps={{ name: 'fullName' }}
              inputRef={register}
              error={errors.fullName ? true : false}
              helperText={errors.fullName?.message}
            ></TextField>

            <InputLabel htmlFor="address" className={classes.mt1}>
              Address
            </InputLabel>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="address"
              autoFocus
              InputProps={{ name: 'address' }}
              inputRef={register}
              error={errors.address ? true : false}
              helperText={errors.address?.message}
            ></TextField>

            <InputLabel htmlFor="city" className={classes.mt1}>
              City
            </InputLabel>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="city"
              autoFocus
              InputProps={{ name: 'city' }}
              inputRef={register}
              error={errors.city ? true : false}
              helperText={errors.city?.message}
            ></TextField>

            <InputLabel htmlFor="postalCode" className={classes.mt1}>
              Postal Code
            </InputLabel>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="postalCode"
              autoFocus
              InputProps={{ name: 'postalCode' }}
              inputRef={register}
              error={errors.postalCode ? true : false}
              helperText={errors.postalCode?.message}
            ></TextField>

            <FormControl fullWidth error={errors.country}>
              <InputLabel htmlFor="country">Country</InputLabel>
              <NativeSelect
                fullWidth
                inputRef={register}
                name="country"
                inputProps={{
                  id: 'country',
                }}
              >
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText> {errors.country?.message}</FormHelperText>
            </FormControl>
            <List>
              <ListItem>
                <Button
                  onClick={() => Router.push('/map')}
                  type="button"
                  variant="contained"
                >
                  Choose on map
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  disabled={formState.isSubmitting}
                  className={classes.submitButton}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Continue
                </Button>
              </ListItem>
            </List>

            {loading && <CircularProgress></CircularProgress>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        )}
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Shipping), {
  ssr: false,
});
