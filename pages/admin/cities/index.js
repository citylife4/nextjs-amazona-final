import { Alert } from '@material-ui/lab';
import {
  Grid,
  Button,
  Box,
  CircularProgress,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  InputBase
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
    case 'CITY_LIST_REQUEST':
      return { ...state, loading: true };
    case 'CITY_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        cities: action.payload,
        pages: action.payload,
      };
    case 'CITY_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CITY_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'CITY_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, success: true };
    case 'CITY_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'CITY_DELETE_RESET':
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

function Cities(props) {
  const classes = useStyles();
  const [
    { loading, error, cities, loadingDelete, errorDelete, successDelete },
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
    const fecthCities = async () => {
      dispatch({ type: 'CITY_LIST_REQUEST', payload: { query: '' } });
      try {
        const { data } = await Axios.get(`/api/cities?query=${query}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'CITY_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'CITY_LIST_LIST_FAILL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthCities();
  }, [successDelete, query]);

  const deleteCityHandler = async (city) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'CITY_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/cities/${city._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'CITY_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'CITY_DELETE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const createCityHandler = async () => {
    dispatch({ type: 'CITY_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/cities`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CITY_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/cities/${data.city._id}`);
    } catch (error) {
      dispatch({
        type: 'CITY_CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Admin Cities">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="cities" />
        </Grid>
        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Typography component="h4" variant="h4">
                Catalog &rsaquo; Cities
              </Typography>
           
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >

           <Grid item>
           {cities.length === 0 ? 'No' : cities.length} Results:{' '}
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {query !== 'all' && query !== '' ? (
                    <Button onClick={() => router.push('/admin/cities')}>
                      <HighlightOffIcon /> 
                    </Button>
                  ) : null}

                </Grid>

                <Grid>
                  <form action="/admin/cities">
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search Cities here…"
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
                  onClick={() => createCityHandler()}
                >
                  Create City
                </Button>

                  </Grid>
              </Grid>


              {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
              {loadingDelete && <CircularProgress />}
              {successDelete && (
                <Alert severity="success">Coupon deleted successfully</Alert>
              )}

              <Slide direction="up" in={true}>
                <TableContainer>
                  <Table aria-label="Coupons">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {cities.map((city) => (
                        <TableRow key={city._id}>
                          <TableCell component="th" scope="row">
                            ...{city._id.substring(20, 24)}
                          </TableCell>
                          <TableCell>{city.name}</TableCell>
                          <TableCell>
                            {city.createdAt.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/cities/${city._id}`}>
                              <Button>
                                <EditIcon style={{ color: 'orange', fontSize: 25 }} />
                              </Button>
                            </Link>
                            <Button onClick={() => deleteCityHandler(city)}>
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

export default dynamic(() => Promise.resolve(Cities), {
  ssr: false,
});
