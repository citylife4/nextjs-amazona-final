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
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'react-day-picker/lib/style.css';

function reducer(state, action) {
  switch (action.type) {
    case 'COUPON_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'COUPON_DETAILS_SUCCESS':
      return { ...state, loading: false, coupon: action.payload };
    case 'COUPON_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'COUPON_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'COUPON_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'COUPON_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'COUPON_UPDATE_RESET':
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

function Coupon({ params }) {
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
  tomorrow.setDate(tomorrow.getDate() + 1);

  const couponId = params.id;

  const [
    { loading, error, coupon, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(tomorrow);
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState(today);

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthCoupon = async () => {
      dispatch({ type: 'COUPON_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/coupons/${couponId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'COUPON_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'COUPON_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (coupon) {
      setId(coupon._id);
      setName(coupon.name);
      setDiscount(coupon.discount);
      setExpiry(coupon.expiry);
    } else {
      fecthCoupon();
    }
  }, [coupon]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'COUPON_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/coupons/${coupon._id}`,
        { name, discount, expiry },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'COUPON_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/coupons');
    } catch (error) {
      dispatch({
        type: 'COUPON_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Edit Coupon">
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
            <React.Fragment>
              <Slide direction="up" in={true}>
                <form className={classes.form} onSubmit={submitHandler}>
                  {coupon && (
                    <Typography component="h4" variant="h4">
                      {id
                        ? `   Catalog › Edit Coupon › ${coupon.name}`
                        : 'Create Coupon'}
                    </Typography>
                  )}
                  <hr />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Discount"
                    name="discount"
                    autoFocus
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <Box className={classes.mt2}>
                    <Typography>Expiry Date</Typography>
                    <br />
                    <DayPickerInput
                      initialMonth={new Date()}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      format={format}
                      value={expiry}
                      placeholder={`${dateFnsFormat(new Date(), format)}`}
                      dayPickerProps={{
                        disabledDays: [
                          startDate,
                          {
                            before: new Date(),
                          },
                        ],
                      }}
                      onDayChange={(day) => setExpiry(day)}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    {id ? 'Update' : 'Create'}
                  </Button>
                  <Box>
                    {loadingUpdate && <CircularProgress></CircularProgress>}
                    {errorUpdate && (
                      <Alert severity="error">{errorUpdate}</Alert>
                    )}
                    {successUpdate && (
                      <Alert severity="success">
                        Coupon updated successfully.
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

export default dynamic(() => Promise.resolve(Coupon), {
  ssr: false,
});
