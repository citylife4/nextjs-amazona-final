import { Alert } from '@material-ui/lab';
import {
  Grid,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Slide,
  Paper,
  InputBase,
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


function reducer(state, action) {
  switch (action.type) {
    case 'COUPON_LIST_REQUEST':
      return { ...state, loading: true };
    case 'COUPON_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        coupons: action.payload.coupons,
        pages: action.payload,
      };
    case 'COUPON_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'COUPON_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'COUPON_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, success: true };
    case 'COUPON_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'COUPON_DELETE_RESET':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
      };
    default:
      return state;
  }
}

function Coupons(props) {
  const classes = useStyles();
  const [
    { loading, error, coupons, loadingDelete, errorDelete, successDelete },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingDelete: false,
    successDelete: false,
    errorDelete: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { query = 'all' } = router.query;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthCoupons = async () => {
      dispatch({ type: 'COUPON_LIST_REQUEST', payload: { query: '' } });
      try {
        const { data } = await Axios.get(`/api/coupons?query=${query}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'COUPON_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'COUPON_LIST_LIST_FAILL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthCoupons();
  }, [successDelete, query]);

  const deleteCouponHandler = async (coupon) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'COUPON_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/coupons/${coupon._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'COUPON_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'COUPON_DELETE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const createCouponHandler = async () => {
    dispatch({ type: 'COUPON_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/coupons`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'COUPON__CREATE_SUCCESS', payload: data });
      Router.push(`/admin/coupons/${data.coupon._id}`);
    } catch (error) {
      dispatch({
        type: 'COUPON__CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Admin Coupons">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="coupons" />
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Typography component="h4" variant="h4">
                Catalog &rsaquo; Coupons
              </Typography>
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >
                <Grid item>
                {coupons.length === 0 ? 'No' : coupons.length} Results:{' '}
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {query !== 'all' && query !== '' ? (
                    <Button onClick={() => router.push('/admin/coupons')}>
                      <HighlightOffIcon />
                    </Button>
                  ) : null}

                </Grid>

                <Grid>
                  <form action="/admin/coupons">
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search Coupons here…"
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
                  style={{ marginRight: '5rem' }}
                  onClick={() => createCouponHandler()}
                >
                  Create Coupon
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
                  <Table aria-label="Coupons">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Discount</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Expiry</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon._id}>
                          <TableCell component="th" scope="row">
                            ...{coupon._id.substring(20, 24)}
                          </TableCell>
                          <TableCell>{coupon.name}</TableCell>
                          <TableCell>{coupon.discount}</TableCell>
                          <TableCell>
                            {coupon.createdAt.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            {coupon.expiry.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/coupons/${coupon._id}`}>
                              <Button>
                                <EditIcon style={{ color: 'orange', fontSize: 25  }} />
                              </Button>
                            </Link>
                            <Button onClick={() => deleteCouponHandler(coupon)}>
                            <DeleteForeverIcon
                              style={{ color: 'red', fontSize: 25 }}
                                    />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Slide>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Coupons), {
  ssr: false,
});
