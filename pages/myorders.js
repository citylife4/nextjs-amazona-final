import { Alert } from '@material-ui/lab';
import {
  Button,
  CircularProgress,
  Grid,
  ListItem,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { Store } from '../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../utils/error';
import { curr } from '../utils/config';
import NextLink from 'next/link';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { useStyles } from '../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'MY_ORDER_LIST_REQUEST':
      return { ...state, loading: true };
    case 'MY_ORDER_LIST_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'MY_ORDER_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function MyOrders() {
  const classes = useStyles();
  const [{ loading, error, orders }, dispatch] = React.useReducer(reducer, {
    loading: true,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthMyOrders = async () => {
      dispatch({ type: 'MY_ORDER_LIST_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/orders/myorder`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'MY_ORDER_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'MY_ORDER_LIST_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthMyOrders();
  }, []);

  return (
    <Layout title="My Orders">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <ListItem href="#">
            <NextLink href="/profile">
              <Link variant="body1" color="inherit" noWrap href="/profile">
                Account Setting
              </Link>
            </NextLink>
          </ListItem>
          <ListItem href="#" className={classes.selected}>
            <NextLink href="/myorders">
              <Link variant="body1" color="inherit" noWrap href="/myorders">
                Order History
              </Link>
            </NextLink>
          </ListItem>

          <ListItem href="#">
            <NextLink href="/addresses">
              <Link variant="body1" color="inherit" noWrap href="/addresses">
                Addresses
              </Link>
            </NextLink>
          </ListItem>
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <React.Fragment>
              <Typography component="h4" variant="h4">
                {' '}
                Order History
              </Typography>
              <hr />
              <Slide direction="up" in={true}>
                <TableContainer>
                  <Table aria-label="Orders">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>See Orders</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell component="th" scope="row">
                            ...{order._id}
                          </TableCell>
                          <TableCell>
                            {order.createdAt.substring(0, 10)}
                          </TableCell>
                          <TableCell align="right">
                            {curr}
                            {order.totalPrice}
                          </TableCell>
                          <TableCell>
                            {order.isPaid ? (
                              order.paidAt.substring(0, 10)
                            ) : (
                              <ClearOutlinedIcon
                                style={{ color: 'red', fontSize: 25 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Link href={`/orders/${order._id}`}>
                              <Button>Details</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Slide>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(MyOrders), {
  ssr: false,
});
