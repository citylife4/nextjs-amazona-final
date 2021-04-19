import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import NextLink from '../components/NextLink';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  Select,
  Button,
  TableRow,
  TableBody,
  MenuItem,
  Typography,
  List,
  Grid,
  ListItem,
  Card,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { Alert } from '@material-ui/lab';
import { CART_REMOVE_ITEM, CART_ADD_ITEM } from '../utils/constants';
import Router from 'next/router';
import { curr } from '../utils/config';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Link from 'next/link';

function Cart() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { cartItems } = state.cart;

  const removeFromCartHandler = (cartItem) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: cartItem,
    });
  };

  const CheckoutHandler = () => {
    Router.push('/shipping');
  };

  const updateCartHandler = async (cartItem, quantity) => {
    const { data } = await axios.get(`/api/products/${cartItem.product}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar(
        data.countInStock <= 0
          ? 'Sorry. This product is out of stock.'
          : `
      We have only ${data.countInStock} items in the stock.`,
        {
          variant: 'error',
        }
      );
    } else {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          product: cartItem._id,
          name: cartItem.name,
          image: cartItem.image,
          price: cartItem.price,
          countInStock: cartItem.countInStock,
          quantity,
        },
      });
      enqueueSnackbar('Product updated in the cart', { variant: 'success' });
    }
  };

  return (
    <Layout title="Shopping">
      <Typography variant="h3" component="h3">
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Alert icon={false} severity="info">
          Cart is Empty. <NextLink href="/">Go shopping</NextLink>
        </Alert>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((cartItem) => (
                    <TableRow key={cartItem.name}>
                      <TableCell
                        className={classes.tableBody}
                        component="th"
                        scope="row"
                      >
                        <NextLink href={`/products/${cartItem.slug}`}>
                          <img
                            height="50"
                            alt={cartItem.name}
                            src={cartItem.image}
                          ></img>
                        </NextLink>
                      </TableCell>
                      <TableCell className={classes.tableBody}>
                        <NextLink href={`/products/${cartItem.slug}`}>
                          {cartItem.name}
                        </NextLink>
                      </TableCell>
                      <TableCell className={classes.tableBody} align="right">
                        <Select
                          labelId="quanitity-label"
                          id="quanitity"
                          className={classes.fullWidth}
                          onChange={(e) =>
                            updateCartHandler(cartItem, e.target.value)
                          }
                          value={cartItem.quantity}
                        >
                          {[...Array(cartItem.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        {curr}
                        {cartItem.price}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          onClick={() => removeFromCartHandler(cartItem)}
                          variant="contained"
                          color="secondary"
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h3">
                    Subtotal ( {cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : {curr}
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  {cartItems.length > 0 && (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={CheckoutHandler}
                    >
                      Check Out
                    </Button>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
