import {
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import Router from 'next/router';
import AdminSidebar from '../../../components/AdminSideBar';
import Layout from '../../../components/Layout';
import { useStyles } from '../../../utils/styles';
import Widget from '../../../components/charts/widget';
import TotalCustomers from '../../../components/charts/TotalCustomers';
import TotalOrders from '../../../components/charts/TotalOrders';
import TotalProducts from '../../../components/charts/TotalProducts';
import { Store } from '../../../components/Store';
import { getErrorMessage } from '../../../utils/error';
import { Alert } from '@material-ui/lab';
import SalesBarChart from '../../../components/charts/SalesChartBar';
import Convert from '../../../components/Convert';
import UserHitChart from '../../../components/charts/UserHitChart';
import CostRevenueChart from '../../../components/charts/CostRevenueChart';
import BrandChart from '../../../components/charts/BrandChart';
import CategoryChart from '../../../components/charts/CategoryChart';

function reducer(state, action) {
  switch (action.type) {
    case 'SUMMARY_LIST_REQUEST':
      return { ...state, loading: true };
    case 'SUMMARY_LIST_SUCCESS':
      return { ...state, loading: false, summary: action.payload };
    case 'SUMMARY_LIST_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

function DashBoard() {
  const classes = useStyles();

  const [{ loading, error, summary }, dispatch] = React.useReducer(reducer, {
    loading: true,
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthListSummary = async () => {
      dispatch({ type: 'SUMMARY_LIST_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/admin`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'SUMMARY_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'SUMMARY_LIST_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthListSummary();
  }, []);

  return (
    <Layout title="Admin Dashboards">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="dashboard" />
        </Grid>
        {loading ? (
          <CircularProgress></CircularProgress>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid item md={9}>
            <Container maxWidth={false}>
              <Grid container spacing={3}>
                <Grid item lg={4} sm={6} xl={4} xs={12}>
                  <Widget saleTotal={Convert(summary.saleTotal)} />
                </Grid>
                <Grid item lg={4} sm={6} xl={4} xs={12}>
                  <TotalCustomers userTotal={Convert(summary.userTotal)} />
                </Grid>
                <Grid item lg={4} sm={6} xl={4} xs={12}>
                  <TotalOrders orderTotal={Convert(summary.orderTotal)} />
                </Grid>

                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <SalesBarChart data={summary.barChartData} />
                </Grid>

                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <UserHitChart data={summary.LineChartData} />
                </Grid>

                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <CostRevenueChart data={summary.costProfitData} />
                </Grid>
              </Grid>
            </Container>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(DashBoard), {
  ssr: false,
});
