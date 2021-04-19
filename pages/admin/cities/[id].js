import { Alert } from '@material-ui/lab';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  CardMedia,
  TextField,
  Typography,
  List,
  ListItem,
  Slide,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../../utils/styles';
import { Store } from '../../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../../utils/error';
import AdminSidebar from '../../../components/AdminSideBar';

function reducer(state, action) {
  switch (action.type) {
    case 'CITY_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'CITY_DETAILS_SUCCESS':
      return { ...state, loading: false, city: action.payload };
    case 'CITY_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CITY_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'CITY_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'CITY_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'CITY_UPDATE_RESET':
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: false,
        errorUpdate: '',
      };

    default:
      return state;
  }
}

function City({ params }) {
  const classes = useStyles();

  const cityId = params.id;

  const [
    { loading, error, city, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthCity = async () => {
      dispatch({ type: 'CITY_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/cities/${cityId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'CITY_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'CITY_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (city) {
      setName(city.name);
    } else {
      fecthCity();
    }
  }, [city]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CITY_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/cities/${city._id}`,
        { name },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CITY_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/cities');
    } catch (error) {
      dispatch({
        type: 'CITY_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Edit Coupon">
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
            <React.Fragment>
              <Slide direction="up" in={true}>
                <form className={classes.form} onSubmit={submitHandler}>
                  <Typography component="h4" variant="h4">
                    Catalog &rsaquo; Edit City &rsaquo; {city.name}
                  </Typography>
                  <hr />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="City"
                    name="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Update
                  </Button>
                  <Box>
                    {loadingUpdate && <CircularProgress></CircularProgress>}
                    {errorUpdate && (
                      <Alert severity="error">{errorUpdate}</Alert>
                    )}
                    {successUpdate && (
                      <Alert severity="success">
                        City updated successfully.
                      </Alert>
                    )}
                  </Box>
                </form>
              </Slide>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(City), {
  ssr: false,
});
