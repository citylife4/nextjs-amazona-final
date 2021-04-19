import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  CircularProgress,
  Chip,
  Link,
} from '@material-ui/core';

import NextLink from 'next/link';
import { PayPalButton } from 'react-paypal-button-v2';

import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../components/Store';
import { getErrorMessage } from '../../utils/error';
import { useStyles } from '../../utils/styles';
import Axios from 'axios';
import Router from 'next/router';
import Image from 'next/image';
import { Alert } from '@material-ui/lab';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-nextjs-toast';
function reducer(state, action) {
  switch (action.type) {
    case 'ORDER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'ORDER_DETAILS_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'ORDER_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'ORDER_PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'ORDER_PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'ORDER_PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'ORDER_PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };

    case 'ORDER_CANCEL_REQUEST':
      return { ...state, loadingCancel: true };
    case 'ORDER_CANCEL_SUCCESS':
      return { ...state, loadingCancel: false, successCancel: true };
    case 'ORDER_CANCEL_FAIL':
      return { ...state, loadingCancel: false, errorCancel: action.payload };
    case 'ORDER_CANCEL_RESET':
      return {
        ...state,
        loadingCancel: false,
        successCancel: false,
        errorCancel: '',
      };
    case 'ORDER_REFUND_REQUEST':
      return { ...state, loadingRefund: true };
    case 'ORDER_REFUND_SUCCESS':
      return { ...state, loadingRefund: false, successRefund: true };
    case 'ORDER_REFUND_FAIL':
      return { ...state, loadingRefund: false, errorRefund: action.payload };
    case 'ORDER_REFUND_RESET':
      return {
        ...state,
        loadingRefund: false,
        successRefund: false,
        errorRefund: '',
      };
    case 'ORDER_DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'ORDER_DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'ORDER_DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'ORDER_DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    case 'ORDER_SEND_REQUEST':
      return { ...state, loadingSend: true };
    case 'ORDER_SEND_SUCCESS':
      return { ...state, loadingSend: false, successSend: true };
    case 'ORDER_SEND_FAIL':
      return { ...state, loadingSend: false, errorSend: action.payload };
    case 'ORDER_SEND_RESET':
      return {
        ...state,
        loadingSend: false,
        successSend: false,
        errorSend: '',
      };
    default:
      return state;
  }
}

function Order({ params }) {
  const classes = useStyles();
  const orderId = params.id;
  const [
    {
      loading,
      error,
      order,
      loadingPayCash,
      errorPayCash,
      successPayCash,
      loadingDeliver,
      errorDeliver,
      successDeliver,
      loadingCancel,
      errorCancel,
      successCancel,
      loadingSend,
      successSend,
      errorSend,
      loadingRefund,
      successRefund,
      errorRefund,

      loadingPay,
      errorPay,
      successPay,
    },
    dispatch,
  ] = React.useReducer(reducer, {
    loadingPay: false,
    successPay: false,
    loading: true,
    loadingPayCash: false,
    successPayCash: false,
    errorPayCash: '',
    loadingDeliver: false,
    successDeliver: false,
    errorDeliver: '',
    loadingCancel: false,
    successCancel: false,
    errorCancel: '',
    loadingSend: false,
    successSend: false,
    errorSend: '',
    loadingRefund: false,
    successRefund: false,
    errorRefund: '',
  });

  const [sdkReady, setSdkReady] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }

    const getMyOrder = async () => {
      dispatch({ type: 'ORDER_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'ORDER_DETAILS_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'ORDER_DETAILS_FAIL',
          payload: getErrorMessage(error),
        });
      }
    };

    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/keys/paypal', {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (
      !order ||
      successPay ||
      successPayCash ||
      successDeliver ||
      successCancel ||
      successSend ||
      successRefund ||
      (order && order._id !== orderId)
    ) {
      getMyOrder();
      dispatch({ type: 'ORDER_PAY_RESET' });
      if (successDeliver) {
        dispatch({ type: 'ORDER_DELIVER_RESET' });
        toast.notify(`Order is delivered`, {
          duration: 5,
          type: 'success',
        });
      }

      if (successCancel) {
        dispatch({ type: 'ORDER_CANCEL_RESET' });
        toast.notify(`Order is cancelled`, {
          duration: 5,
          type: 'success',
        });
      }

      if (successSend) {
        dispatch({ type: 'ORDER_SEND_RESET' });
        toast.notify(`Order is sent`, {
          duration: 5,
          type: 'success',
        });
      }

      if (successRefund) {
        dispatch({ type: 'ORDER_REFUND_RESET' });
        toast.notify(`Order is refunded`, {
          duration: 5,
          type: 'success',
        });
      }
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [
    order,
    successPay,
    successPayCash,
    successDeliver,
    successCancel,
    successSend,
    successRefund,
  ]);

  const payOrderHandler = async (paymentResult) => {
    dispatch({ type: 'ORDER_PAY_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/pay`,
        paymentResult,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_PAY_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ORDER_PAY_FAIL', payload: getErrorMessage(error) });
    }
  };
  const handleSuccessCashPayment = async () => {
    dispatch({ type: 'ORDER_PAY_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/cashpay`,
        {
          id: '',
          status: 'Paid by Cash',
          update_time: '',
          email_address: `${userInfo.email}`,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_PAY_SUCCESS', payload: data });
      getMyOrder();
    } catch (error) {
      dispatch({ type: 'ORDER_PAY_FAIL', payload: getErrorMessage(error) });
    }
  };

  const handleDeliverOrder = async (order) => {
    dispatch({ type: 'ORDER_DELIVER_REQUEST', payload: {} });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_DELIVER_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_DELIVER_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const handleCancelOrder = async (order) => {
    dispatch({ type: 'ORDER_CANCEL_REQUEST', payload: {} });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/cancel`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_CANCEL_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_CANCEL_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const handleSendOrder = async (order) => {
    dispatch({ type: 'ORDER_SEND_REQUEST', payload: {} });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/send`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_SEND_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_SEND_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const handleRefundOrder = async (order) => {
    dispatch({ type: 'ORDER_REFUND_REQUEST', payload: {} });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/refund`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_REFUND_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_REFUND_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Order Details">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <ToastContainer />
          <Typography component="h1" variant="h1">
            <NextLink href="/myorders">
              <Link href="/myorders">Order History</Link>
            </NextLink>
            &nbsp; &rsaquo; Order {orderId}
          </Typography>
          <Grid container spacing={2}>
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
                      <Grid item>Status:</Grid>
                      <Grid item>
                        {order.isDelivered ? (
                          <Chip
                            label="Delivered"
                            icon={<DoneIcon />}
                            className={classes.success}
                          />
                        ) : (
                          <Chip
                            label="Not delivered"
                            icon={<CloseIcon />}
                            className={classes.warning}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item> Address: </Grid>
                      <Grid item>
                        {order.shippingAddress.fullName} -{' '}
                        {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.postalCode},{' '}
                        {order.shippingAddress.country}
                      </Grid>
                    </Grid>
                  </ListItem>

                  {order.isDelivered && (
                    <ListItem>
                      <Grid container justify="space-between">
                        <Grid item>Delivered Date:</Grid>
                        <Grid item>
                          {dayjs(order.deliveredAt).format('DD-MMMM-YYYY', {
                            timeZone: 'UTC',
                          })}
                        </Grid>
                      </Grid>
                    </ListItem>
                  )}

                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>Selected Delivery Date:</Grid>
                      <Grid item>
                        [
                        {dayjs(order.deliverScheduledAt).format(
                          'DD-MMMM-YYYY',
                          {
                            timeZone: 'UTC',
                          }
                        )}
                        {' - '}
                        {dayjs(order.deliverScheduledTo).format(
                          'DD-MMMM-YYYY',
                          {
                            timeZone: 'UTC',
                          }
                        )}
                        ] [{order.deliverScheduledTime}]
                      </Grid>
                    </Grid>
                  </ListItem>
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
                      <Grid item>Status:</Grid>
                      <Grid item>
                        {order.isPaid ? (
                          <Chip
                            label="Paid"
                            icon={<DoneIcon />}
                            className={classes.success}
                          />
                        ) : (
                          <Chip
                            label="Not paid"
                            icon={<CloseIcon />}
                            className={classes.warning}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>Method:</Grid>
                      <Grid item>{order.paymentMethod}</Grid>
                    </Grid>
                  </ListItem>

                  {order.isPaid && (
                    <ListItem>
                      <Grid container justify="space-between">
                        <Grid item>Date:</Grid>
                        <Grid item>
                          {dayjs(order.paidAt).format('DD-MMMM-YYYY', {
                            timeZone: 'UTC',
                          })}
                        </Grid>
                      </Grid>
                    </ListItem>
                  )}
                </List>
              </Card>

              <Card className={classes.mt1}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant="h2">
                      Items
                    </Typography>
                  </ListItem>
                </List>

                <Grid container>
                  <TableContainer>
                    <Table aria-label="Orders">
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderItems.map((x) => (
                          <TableRow key={x.name}>
                            <TableCell component="th" scope="row">
                              <Image
                                alt={x.name}
                                src={x.image}
                                width={100}
                                height={100}
                                layout="fixed"
                                unoptimized
                              ></Image>
                            </TableCell>
                            <TableCell>{x.name}</TableCell>
                            <TableCell align="right">{x.quantity}</TableCell>
                            <TableCell align="right">{x.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">Order Summary</Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>Items</Grid>
                      <Grid item>
                        <Typography align="right">
                          ${order.itemsPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>Shipping</Grid>
                      <Grid item>
                        <Typography align="right">
                          ${order.shippingPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>Tax</Grid>
                      <Grid item>
                        <Typography align="right">${order.taxPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography variant="h6">Total</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" align="right">
                          ${order.totalPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {!order.isPaid && (
                    <ListItem>
                      {!sdkReady ? (
                        <CircularProgress />
                      ) : (
                        <Box className={classes.fullWidth}>
                          {errorPay && (
                            <Alert severity="error">{errorPay}</Alert>
                          )}
                          {loadingPay && <CircularProgress />}

                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={payOrderHandler}
                          ></PayPalButton>
                        </Box>
                      )}
                    </ListItem>
                  )}

                  {userInfo.isAdmin &&
                    !order.isPaid &&
                    order.paymentMethod === 'cash' && (
                      <ListItem>
                        {errorPayCash && (
                          <Alert severity="error">{errorPayCash}</Alert>
                        )}
                        {loadingPayCash && <CircularProgress />}
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="default"
                          onClick={() => handleSuccessCashPayment()}
                        >
                          Confirm Payment
                        </Button>
                      </ListItem>
                    )}

                  {order.isPaid && !order.isDelivered && !order.isCanceled && (
                    <ListItem>
                      {errorCancel && (
                        <Alert severity="error">{errorCancel}</Alert>
                      )}
                      {loadingCancel && <CircularProgress />}
                      <Button
                        fullWidth
                        variant="contained"
                        color="defult"
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </Button>
                    </ListItem>
                  )}

                  {!order.isRefunded && order.isDelivered && (
                    <React.Fragment>
                      <ListItem>
                        {errorRefund && (
                          <Alert severity="error">{errorRefund}</Alert>
                        )}
                        {loadingRefund && <CircularProgress />}
                        <Button
                          fullWidth
                          variant="contained"
                          color="defult"
                          onClick={() => handleRefundOrder(order)}
                        >
                          Refund Order
                        </Button>
                      </ListItem>
                    </React.Fragment>
                  )}

                  {userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isSent &&
                    !order.isCanceled && (
                      <ListItem>
                        {errorSend && (
                          <Alert severity="error">{errorSend}</Alert>
                        )}
                        {loadingSend && <CircularProgress />}
                        <Button
                          fullWidth
                          variant="contained"
                          color="defult"
                          onClick={() => handleSendOrder(order)}
                        >
                          Send Order
                        </Button>
                      </ListItem>
                    )}

                  {userInfo.isAdmin &&
                    order.isPaid &&
                    order.isSent &&
                    !order.isDelivered &&
                    !order.isCanceled && (
                      <ListItem>
                        {errorDeliver && (
                          <Alert severity="error">{errorDeliver}</Alert>
                        )}
                        {loadingDeliver && <CircularProgress />}
                        <Button
                          fullWidth
                          variant="contained"
                          color="defult"
                          onClick={() => handleDeliverOrder(order)}
                        >
                          Deliver Order
                        </Button>
                      </ListItem>
                    )}

                  {!order.isPaid && order.paymentMethod === 'cash' && (
                    <ListItem>
                      <Alert severity="success">
                        Your Order {orderId} is completed Please wait until
                        shippment and provide cash at the delivery
                      </Alert>
                    </ListItem>
                  )}

                  {order.isPaid && (
                    <ListItem>
                      <Button fullWidth variant="contained" color="defult">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="text-center"
                          href={`/api/orders/${order._id}/invoice`}
                        >
                          Download Invoice
                        </a>
                      </Button>

                      {/* 
                      1. create a form
                      2. put a submit button
                      3. hidden input and set value to token
                      4. in backend read the token and validate user
                      5. if it is ok then return the pdf file
                      6. otherwize return error
                      */}
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default Order;
