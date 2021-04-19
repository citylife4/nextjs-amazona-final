import Image from 'next/image';
import React, { useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import CheckoutSteps from '../components/CheckoutSteps';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import { useStyles } from '../utils/styles';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import Axios from 'axios';
import {
  Card,
  Grid,
  Button,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Box,
} from '@material-ui/core';
import { CART_CLEAR } from '../utils/constants';
import { getErrorMessage } from '../utils/error';
import { Alert } from '@material-ui/lab';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'react-day-picker/lib/style.css';
import EditIcon from '@material-ui/icons/Edit';

function placeorder() {
  const classes = useStyles();

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    return DateUtils.isDate(parsed) ? parsed : null;
  };

  const formatDate = (date, format, locale) =>
    dateFnsFormat(date, format, { locale });

  const format = 'dd MMM yyyy';

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart, loadingCoupon, errorCoupon, discount } = state;
  const { cartItems, paymentMethod, shippingAddress } = cart;

  const [deliverScheduledAt, setDeliverScheduledAt] = useState(tomorrow);

  const [deliverScheduledTime, setDeliverScheduledTime] = useState('Any Time');
  const [startDate, setStartDate] = useState(today);
  const [coupon, setCoupon] = useState('');

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const totalBuyPrice = cartItems.reduce((a, c) => a + c.buyPrice * c.qty, 0);
  const shippingPrice = shippingAddress.price;
  const taxPrice = Math.round(0.18 * itemsPrice * 100) / 100;
  const totalPrice = Math.round(itemsPrice + shippingPrice + taxPrice);
  const discountPrice = Math.round(((totalPrice * discount) / 100) * 100) / 100;
  const netPrice = Math.round(totalPrice - discountPrice);

  useEffect(() => {
    if (!paymentMethod || !userInfo) {
      Router.push('/payment');
    }
  }, []);

  const clearCartHandler = () => {
    dispatch({
      type: CART_CLEAR,
    });
    Cookies.remove('cartItems');
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          paymentMethod,
          shippingAddress,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          totalBuyPrice,
          deliverScheduledAt,
          deliverScheduledTime,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      clearCartHandler();
      Router.push('/orders/' + data.order._id);
    } catch (error) {
      setLoading(false);
      setError(getErrorMessage(error));
    }
  };

  const applyCouponHandler = async (coupon) => {
    dispatch({ type: 'ORDER_APPLY_COUPON_REQUEST' });
    try {
      const { data } = await Axios.get(
        '/api/orders/coupon/' + coupon,

        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_APPLY_COUPON_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_APPLY_COUPON_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutSteps activeStep={4}></CheckoutSteps>

      <Typography component="h1" variant="h1">
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9}>
          <Card>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container justify="space-between">
                  <Grid item> Address: </Grid>
                  <Grid item>
                    {shippingAddress.fullName} - {shippingAddress.address},
                    {shippingAddress.city}, {shippingAddress.postalCode},
                    {shippingAddress.country}
                  </Grid>
                  <Grid item>
                    <EditIcon
                      style={{
                        color: 'orange',
                        fontSize: 25,
                        cursor: 'pointer',
                      }}
                      onClick={() => Router.push('/shipping')}
                    />
                  </Grid>
                </Grid>
              </ListItem>

              {/* <ListItem>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => Router.push('/shipping')}
                >
                  Edit Address
                </Button>
              </ListItem> */}
            </List>
          </Card>
          <Card className={classes.mt1}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container justify="space-between">
                  <Grid item> Payment Method: </Grid>
                  <Grid item>{paymentMethod}</Grid>
                  <Grid item>
                    <EditIcon
                      style={{
                        color: 'orange',
                        fontSize: 25,
                        cursor: 'pointer',
                      }}
                      onClick={() => Router.push('/payment')}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              {/* <ListItem>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => Router.push('/payment')}
                >
                  Edit Payment
                </Button>
              </ListItem> */}
            </List>
          </Card>
          <Card className={[classes.mt1, classes.p1]}>
            <Typography component="h2" variant="h2">
              Order Items
            </Typography>

            <Grid container>
              <TableContainer>
                <Table aria-label="Orders">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((cartItem) => (
                      <TableRow key={cartItem.name}>
                        <TableCell component="th" scope="row">
                          <Image
                            alt={cartItem.name}
                            src={cartItem.image}
                            width={100}
                            height={100}
                            layout="fixed"
                            unoptimized
                          ></Image>
                        </TableCell>
                        <TableCell>{cartItem.name}</TableCell>
                        <TableCell>{cartItem.quantity}</TableCell>
                        <TableCell>${cartItem.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Typography variant="h3">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    Items
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    Shipping
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      {shippingPrice === 0 ? (
                        'Free Shipping'
                      ) : (
                        <Typography>${shippingPrice}</Typography>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    Tax
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="h3">Total</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" align="right">
                      ${totalPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3">Discount</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" align="right">
                      ${discountPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3">Net Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" align="right">
                      ${netPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Card>

          <List>
            <ListItem>Do you have coupon?</ListItem>
            <ListItem>
              <TextField
                placeholder="Coupon Code"
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />

              <Button
                type="button"
                variant="contained"
                onClick={() => applyCouponHandler(coupon)}
              >
                Apply
              </Button>
            </ListItem>
            <ListItem>
              {loadingCoupon && <CircularProgress></CircularProgress>}
              {errorCoupon && <Alert severity="error">{errorCoupon}</Alert>}
            </ListItem>
          </List>

          <List>
            <ListItem>
              <Typography variant="h7">Delivery Date</Typography>
              <DayPickerInput
                initialMonth={new Date()}
                formatDate={formatDate}
                parseDate={parseDate}
                format={format}
                value={deliverScheduledAt}
                placeholder={`${dateFnsFormat(new Date(), format)}`}
                dayPickerProps={{
                  disabledDays: [
                    startDate,
                    {
                      before: new Date(),
                    },
                  ],
                }}
                onDayChange={(day) => setDeliverScheduledAt(day)}
                style={{ marginLeft: '1rem' }}
              />
            </ListItem>

            <ListItem>
              <Typography variant="h7">Delivery Time</Typography>

              <Select
                value={deliverScheduledTime}
                style={{ minWidth: '3rem', marginLeft: '1rem' }}
                onChange={(e) => setDeliverScheduledTime(e.target.value)}
              >
                <MenuItem value="Any Time">Any Time</MenuItem>
                <MenuItem value="8 AM to 11 AM">8 AM to 11 AM</MenuItem>
                <MenuItem value="13 PM to 16 PM">13 PM to 16 PM</MenuItem>
                <MenuItem value="17 PM to 20 PM">17 PM to 20 PM</MenuItem>
              </Select>
            </ListItem>

            <ListItem>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListItem>
            <ListItem>
              {loading && <CircularProgress></CircularProgress>}
              {error && <Alert severity="error">{error}</Alert>}
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(placeorder), {
  ssr: false,
});
