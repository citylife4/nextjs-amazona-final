import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Store } from '../components/Store';
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  Button,
  Typography,
  TableRow,
  TableBody,
  Grid,
} from '@material-ui/core';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';
import { useStyles } from '../utils/styles';
import Layout from '../components/Layout';
import {
  WISH_REMOVE_ITEM,
  WISH_CLEAR,
  CART_ADD_ITEM,
} from '../utils/constants';
import { Alert } from '@material-ui/lab';
import Router from 'next/router';
import Cookies from 'js-cookie';

function Wish() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { wishItems } = state.wish;
  const { cartItems } = state.cart;

  const removeFromWishHandler = (wishItem) => {
    dispatch({
      type: WISH_REMOVE_ITEM,
      payload: wishItem,
    });
  };

  const clearWishHandler = () => {
    dispatch({
      type: WISH_CLEAR,
    });
    Cookies.remove('wishItems');
  };

  const addToCartHandler = (wishItem) => {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        slug: wishItem.slug,
        name: wishItem.name,
        image: wishItem.image,
        price: wishItem.price,
        countInStock: wishItem.countInStock,
        quantity: wishItem.quantity,
      },
    });

    Router.push('/cart');
    clearWishHandler();
  };

  return (
    <Layout title="Wish List">
      <Typography variant="h1" component="h1">
        Wish List
      </Typography>

      {wishItems.length === 0 ? (
        <Alert icon={false} severity="info">
          WishList is empty. <Link href="/">Go shopping</Link>
        </Alert>
      ) : (
        <Grid container>
          <TableContainer>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qauntity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wishItems.map((wishItem) => (
                  <TableRow key={wishItem.name}>
                    <TableCell component="th" scope="row">
                      <img
                        height="150"
                        alt={wishItem.name}
                        src={wishItem.image}
                      ></img>
                    </TableCell>
                    <TableCell>{wishItem.name}</TableCell>

                    <TableCell>${wishItem.price}</TableCell>

                    <TableCell>{wishItem.quantity}</TableCell>

                    <TableCell>
                      <Button
                        onClick={() => removeFromWishHandler(wishItem)}
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: '1rem' }}
                      >
                        x
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={() => addToCartHandler(wishItem)}
                      >
                        <AddCircleOutlineSharpIcon />
                        Cart
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Wish), {
  ssr: false,
});
