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

function Users() {
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    loading,
    error,
    users,
    loadingDelete,
    errorDelete,
    successDelete,
  } = state;
  const router = useRouter();
  const { query = 'all' } = router.query;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthUsers = async () => {
      dispatch({ type: 'USER_LIST_REQUEST', payload: { query: '' } });
      try {
        const { data } = await Axios.get(`/api/users?query=${query}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USER_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'USER_LIST_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthUsers();
  }, [successDelete, query]);

  const deleteUserHandler = async (user) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'USER_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/users/${user._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'USER_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'USER_DELETE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const createUserHandler = async () => {
    dispatch({ type: 'USER_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/users`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'USER_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/users/${data.user._id}`);
    } catch (error) {
      dispatch({
        type: 'USER_CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Admin Users">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="users" />
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Typography component="h4" variant="h4">
                Catalog &rsaquo; Users
              </Typography>
              
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >
                 <Grid item>
                 {users.length === 0 ? 'No' : users.length} Results:{' '}
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {query !== 'all' && query !== '' ? (
                    <Button onClick={() => router.push('/admin/users')}>
                      <HighlightOffIcon /> 
                    </Button>
                  ) : null}
                </Grid>

                <Grid>
                  <form action="/admin/users">
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search Users here…"
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

                

              </Grid>

              
              {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
              {loadingDelete && <CircularProgress />}
              {successDelete && (
                <Alert severity="success">User deleted successfully</Alert>
              )}

              <Slide direction="up" in={true}>
                <TableContainer>
                  <Table aria-label="Users">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>email</TableCell>
                        <TableCell>IsAdmin</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell component="th" scope="row">
                            ...{user._id.substring(20, 24)}
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            <Link href={`/admin/users/${user._id}`}>
                              <Button>
                                <EditIcon style={{color:'orange', fontSize: 25}} />
                              </Button>
                            </Link>
                            <Button onClick={() => deleteUserHandler(user)}>
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

export default dynamic(() => Promise.resolve(Users), {
  ssr: false,
});
