import { Alert } from '@material-ui/lab';
import {
  Box,
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Slide,
  TextField,
  Typography,
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

function User({ params }) {
  const classes = useStyles();
  const userId = params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState(0);
  const [isAdmin, setIsAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    loading,
    error,
    user,
    loadingUpdate,
    errorUpdate,
    successUpdate,
  } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthUser = async () => {
      dispatch({ type: 'USER_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USER_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'USER_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    } else {
      fecthUser();
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      return dispatch({
        type: 'USER_UPDATE_FAIL',
        payload: 'Passwords are not matched',
      });
    }
    dispatch({ type: 'USER_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/users/${user._id}`,
        {
          name,
          email,
          isAdmin,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'USER_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/users');
    } catch (error) {
      dispatch({
        type: 'USER_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Edit User">
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
            <React.Fragment>
              <Slide direction="up" in={true}>
                <form className={classes.form} onSubmit={submitHandler}>
                  {user && (
                    <Typography component="h4" variant="h4">
                      Edit User &#8594; {user.name}
                    </Typography>
                  )}
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
                    label="Email"
                    name="email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="admin"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Is Admin"
                  />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        User updated successfully.
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

export default dynamic(() => Promise.resolve(User), {
  ssr: false,
});
