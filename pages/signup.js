import { useForm } from 'react-hook-form';
import Axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { Button, TextField, Typography, Grid } from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Router from 'next/router';
import Cookies from 'js-cookie';
import { USER_SIGNIN } from '../utils/constants';
import { getErrorMessage } from '../utils/error';
import { Store } from '../components/Store';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please Enter a valid email'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function Signup() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { register, handleSubmit, errors, formState, getValues } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (signupdata) => {
    setLoading(true);
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name: signupdata.name,
        email: signupdata.email,
        password: signupdata.password,
        confirmPassword: signupdata.confirmPassword,
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
    <Layout title="Sign Up">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Sign Up
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          autoFocus
          InputProps={{ name: 'name' }}
          inputRef={register}
          error={errors.name ? true : false}
          helperText={errors.name?.message}
        ></TextField>
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          InputProps={{ name: 'confirmPassword', autoComplete: 'none' }}
          inputRef={register}
          error={errors.confirmPassword ? true : false}
          helperText={errors.confirmPassword?.message}
        ></TextField>

        <Button
          disabled={formState.isSubmitting}
          className={classes.submitButton}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>

        <Grid container>
          <Grid item className={classes.pading1}>
            Already have an account?{' '}
            <Link href="/signin" variant="body2">
              Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Signup), {
  ssr: false,
});
