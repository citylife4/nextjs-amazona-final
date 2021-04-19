import {
  Box,
  Button,
  CircularProgress,
  Grid,
  ListItem,
  TextField,
  Typography,
  Link,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Cookies from 'js-cookie';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { getErrorMessage } from '../utils/error';
import { useStyles } from '../utils/styles.js';
import { Store } from '../components/Store';
import { USER_SIGNIN } from '../utils/constants.js';
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-nextjs-toast';
import NextLink from 'next/link';
import ImagePicker from '../components/ImagePicker';

function Profile() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state; 
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const imageSelectHandler = (selectedImage) => {
    setAvatar(selectedImage);
  }

  
  useEffect(() => {
    if (!userInfo) {
      Router.push('/signin');
    } else { 
      setName(userInfo.name);
      setAvatar(userInfo.avatar);
      setEmail(userInfo.email || '');
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setLoading(false);
        setError('Passwords are not matched');
        return;
      }
      const { data } = await Axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          avatar,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: USER_SIGNIN, payload: data });
      Cookies.set('userInfo', data);
      setSuccess(true);
      setLoading(false);
      toast.notify(data.message, {
        duration: 5,
        type: 'success',
      });
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  return (
    <Layout title="Profile">     
        <Grid container spacing={1}>
          <Grid item md={3}>
            <ListItem href="#" className={classes.selected}>
              <NextLink href="/profile">
                <Link variant="body1" color="inherit" noWrap href="/profile">
                  Account Setting
                </Link>
              </NextLink>
            </ListItem>
            <ListItem href="#">
              <NextLink href="/myorders">
                <Link variant="body1" color="inherit" noWrap href="/myorders">
                  Order History
                </Link>
              </NextLink>
            </ListItem>
            <ListItem href="#">
              <NextLink href="/addresses">
                <Link variant="body1" color="inherit" noWrap href="/addresses">
                  Addresses
                </Link>
              </NextLink>
            </ListItem>
          </Grid>

          <Grid item md={9}>
            {name &&  <form className={classes.form} onSubmit={submitHandler}>
              {userInfo &&(
                 <Typography variant="h4">
                {userInfo.name}'s Profile &rsaquo; Edit User Info
              </Typography>
              )}
             
              <hr />
              
              <ImagePicker
                image={avatar}
                 label="User Avatar"
                onImageSelect={imageSelectHandler}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={confirmPassword}
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
              {success && <ToastContainer />}
              {loading &&  <CircularProgress/>}
              { error &&  <Alert severity="error">{error}</Alert>              }
            </form>}
           
          </Grid>
        </Grid>      
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
});
