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

import React, { useContext, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../../utils/error';
import AdminSidebar from '../../../components/AdminSideBar';
import { Store } from '../../../components/Store';
import { useStyles } from '../../../utils/styles';
import Link from 'next/link';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


function reducer(state, action) {
  switch (action.type) {
        case 'SETTING_LIST_REQUEST':
          return { ...state, loading: true };
        case 'SETTING_LIST_SUCCESS':
          return {
            ...state,
            loading: false,
            settings: action.payload,
            pages: action.payload,
          };
        case 'SETTING__LIST_FAIL':
          return { ...state, loading: false, error: action.payload };
    
        case 'SETTING_DELETE_REQUEST':
          return { ...state, loadingDelete: true };
        case 'SETTING_DELETE_SUCCESS':
          return { ...state, loadingDelete: false, successDelete: true };
        case 'SETTING__DELETE_FAIL':
          return { ...state, loadingDelete: false, errorDelete: action.payload };
        case 'SETTING__DELETE_RESET':
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

function Settings(props) {

  const classes = useStyles();
  const [
    { loading,error,settings,successDelete,loadingDelete,errorDelete },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    
  });

  const { state } = useContext(Store);
  const { userInfo } = state;  

 


useEffect(() => {
  if (!userInfo) {
    return Router.push('/signin');
  }
  
  const fecthSettings = async () => {
    dispatch({ type: 'SETTING_LIST_REQUEST'});
    try {
      const { data } = await Axios.get(`/api/admin/setting`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'SETTING_LIST_SUCCESS', payload: data });
    } catch (err) {
      dispatch({
        type: 'SETTING_LIST_LIST_FAILL',
        payload: getErrorMessage(err),
      });
    }
  };
  fecthSettings();

  

}, [successDelete])


const bestSellerHandler = async () => {
  dispatch({ type: 'BESTSELLER_PRODUCTS_REQUEST', payload: { query: '' } });
  try {
    const { data } = await Axios.get(`/api/admin/bestsellerjob`, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: 'BESTSELLER_PRODUCTS_SUCCESS', payload: data });
  } catch (err) {
    dispatch({
      type: 'BESTSELLER_PRODUCTS_FAILL',
      payload: getErrorMessage(err),
    });
  }
};


const topRatedHandler = async () => {
  dispatch({ type: 'TOPRATED_PRODUCTS_REQUEST', payload: { query: '' } });
  try {
    const { data } = await Axios.get(`/api/admin/topratedjob`, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: 'TOPRATED_PRODUCTS_SUCCESS', payload: data });
  } catch (err) {
    dispatch({
      type: 'TOPRATED_PRODUCTS_FAILL',
      payload: getErrorMessage(err),
    });
  }
};

const deleteSettingHandler = async (setting) => {
  if (!window.confirm('Are you sure to delete?')) {
    return;
  }
  dispatch({ type: 'SETTING_DELETE_REQUEST' });
  try {
    const { data } = await Axios.delete(`/api/admin/setting/${setting._id}`, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: 'SETTING_DELETE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'SETTING_DELETE_FAIL',
      payload: getErrorMessage(error),
    });
  }
};

const createSettingHandler = async () => {
  dispatch({ type: 'SETTING_CREATE_REQUEST' });
  try {
    const { data } = await Axios.post(
      `/api/admin/setting`,
      {},
      {
        headers: { authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: 'SETTING_CREATE_SUCCESS', payload: data });
    Router.push(`/admin/settings/${data.setting._id}`);
  } catch (error) {
    dispatch({
      type: 'SETTING_CREATE_FAIL',
      payload: getErrorMessage(error),
    });
  }
};

return(
  <Layout title="Admin Coupons">
   <Grid container spacing={1}>
   <Grid item md={3}>
          <AdminSidebar selected="settings" />
        </Grid>

        <Grid item md={9}>
        {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
           <Paper className={classes.p1}>
           <Typography component="h4" variant="h4">
                Catalog &rsaquo; Settings
              </Typography>
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >
                 <Grid item>
                 <Button
                  variant="outlined"
                  color="default"
                  className={classes.mt1}
                  onClick={() => bestSellerHandler()}
                >
                  Refresh BestSeller Products
                </Button>
               
                 </Grid>
                 <Grid item>
                 <Button
                  variant="outlined"
                  color="default"
                  className={classes.mt1}
                  onClick={() => topRatedHandler()}
                >
                  Refresh Toprated Products
                </Button>
                
                 </Grid>

                 <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '5rem' }}
                  onClick={() => createSettingHandler()}
                >
                  Add Settings
                </Button>
                  </Grid>
                </Grid>  

                {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
               {loadingDelete && <CircularProgress />}
               {successDelete && (
                <Alert severity="success">Setting deleted successfully</Alert>
              )}

              <Slide direction="up" in={true}>
                  <TableContainer>
                    <Table aria-label="Coupons">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Site Name</TableCell>
                        <TableCell>Site Logo</TableCell>
                        <TableCell>Site Theme</TableCell>
                        <TableCell>Page Size</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                    {settings.map((setting) => (
                        <TableRow key={setting._id}>
                            <TableCell component="th" scope="row">
                            ...{setting._id.substring(20, 24)}
                          </TableCell>

                          <TableCell>
                            {setting.siteName}
                          </TableCell>

                          
                          <TableCell>
                          <img
                          src={setting.siteLogo}
                          alt={setting.siteName}
                          className={classes.imageSmall}
                        />
                          </TableCell>

                          <TableCell>
                          {setting.theme}
                          </TableCell>

                          <TableCell>
                          {setting.pageSize}
                          </TableCell>
                           
                          <TableCell>
                          {setting.isActive ? 'YES' : 'NO'}
                          </TableCell>

                          <TableCell>
                            {setting.createdAt.substring(0, 10)}
                          </TableCell>

                          <TableCell>
                            <Link href={`/admin/settings/${setting._id}`}>
                              <Button>
                                <EditIcon style={{ color: 'orange', fontSize: 25 }} />
                              </Button>
                            </Link>
                            <Button onClick={() => deleteSettingHandler(setting)}>
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
)  

}


export default dynamic(() => Promise.resolve(Settings), {
  ssr: false,
});



