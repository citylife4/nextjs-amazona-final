import { Alert } from '@material-ui/lab';
import {
  Grid,
  Button,
  CircularProgress,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputBase,
  Paper,
} from '@material-ui/core';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import { Store } from '../../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../../utils/error';
import Link from 'next/link';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useStyles } from '../../../utils/styles';
import AdminSidebar from '../../../components/AdminSideBar';
import NextPagination from '../../../components/NextPagination';
import { useRouter } from 'next/router';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SearchIcon from '@material-ui/icons/Search';

function Products() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    loading,
    error,
    products,
    loadingDelete,
    errorDelete,
    successDelete,
    pages,
  } = state;
  const router = useRouter();
  const { query = 'all' } = router.query;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthProducts = async () => {
      dispatch({ type: 'PRODUCT_LIST_REQUEST', payload: { query: '' } });
      try {
        const { data } = await Axios.get(`/api/products?query=${query}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data.products });
      } catch (err) {
        dispatch({
          type: 'PRODUCT_LIST_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthProducts();
  }, [successDelete, query]);

  const deleteProductHandler = async (product) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'PRODUCT_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/products/${product._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'PRODUCT_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'PRODUCT_DELETE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const createProductHandler = async () => {
    dispatch({ type: 'PRODUCT_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PRODUCT_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/products/${data.product._id}`);
    } catch (error) {
      dispatch({
        type: 'PRODUCT_CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Admin Products">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="products" />
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Typography component="h4" variant="h4">
                Catalog &rsaquo; Products
              </Typography>
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >
                <Grid item>
                  {products.length === 0 ? 'No' : products.length} products{' '}
                  {query !== 'all' && query !== '' && ' | query : ' + query}
                  {query !== 'all' && query !== '' ? (
                    <Button onClick={() => router.push('/admin/products')}>
                      <HighlightOffIcon />
                    </Button>
                  ) : null}
                </Grid>
                <Grid>
                  <form action="/admin/products">
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search Products here…"
                        name="query"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                      />
                    </div>
                  </form>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => createProductHandler()}
                  >
                    New Product
                  </Button>
                </Grid>
              </Grid>
              {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
              {loadingDelete && <CircularProgress />}
              {successDelete && (
                <Alert severity="success">Product deleted successfully</Alert>
              )}
              <Slide direction="up" in={true}>
                <TableContainer>
                  <Table aria-label="Products">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Sold</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell component="th" scope="row">
                            ...{product._id.substring(20, 24)}
                          </TableCell>
                          <TableCell>
                            <Image
                              src={product.image}
                              width={100}
                              height={100}
                              alt={product.name}
                              layout="fixed"
                              unoptimized
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">${product.price}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.countInStock}</TableCell>
                          <TableCell>{product.sold}</TableCell>
                          <TableCell>
                            <Link href={`/admin/products/${product._id}`}>
                              <Button className={classes.smallButton}>
                                <EditIcon
                                  style={{ color: 'orange', fontSize: 25 }}
                                />
                              </Button>
                            </Link>
                            <Button
                              className={classes.smallButton}
                              onClick={() => deleteProductHandler(product)}
                            >
                              <DeleteForeverIcon
                                style={{ color: 'red', fontSize: 25 }}
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <NextPagination
                    prefix="/admin/products"
                    className={classes.mt1}
                    totalPages={pages}
                  ></NextPagination>
                </TableContainer>
              </Slide>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Products), {
  ssr: false,
});
