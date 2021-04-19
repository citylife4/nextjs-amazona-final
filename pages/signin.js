import { useForm } from 'react-hook-form';
import Axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { Alert } from '@material-ui/lab';
import { Button, TextField, Typography, Grid } from '@material-ui/core';
import { useStyles } from '../utils/styles';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Store } from '../components/Store';
import { USER_SIGNIN } from '../utils/constants';
import Cookies from 'js-cookie';
import { getErrorMessage } from '../utils/error';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please Enter a valid email'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Signin() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { register, handleSubmit, errors, formState, getValues } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (loginData) => {
    setLoading(true);
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email: loginData.email,
        password: loginData.password,
      });
      dispatch({ type: USER_SIGNIN, payload: data });
      Cookies.set('userInfo', data);
      Router.push('/');
    } catch (error) {
      setLoading(false);
      setError(getErrorMessage(error));
    }
  };

  return (
    <Layout title="Sign In">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Sign In
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          InputProps={{ name: 'email' }}
          inputRef={register}
          error={errors.email ? true : false}
          helperText={errors.email?.message}
        ></TextField>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="password"
          label="Password"
          type="password"
          InputProps={{ name: 'password', autoComplete: 'none' }}
          inputRef={register}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        ></TextField>

        <Button
          disabled={formState.isSubmitting}
          className={classes.submitButton}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        {error && (
          <Alert className={classes.mt1} icon={false} severity="error">
            {error}
          </Alert>
        )}

        <Grid container className={classes.pading1}>
          <Grid item xs>
            <Link Link href="/forget-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            Don't have an account?{' '}
            <Link href="/signup" variant="body2">
              Sign Up
            </Link>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Signin), {
  ssr: false,
});
