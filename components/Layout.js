import React, { useContext, useEffect } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import NavBar from './NavBar';
import Footer from './Footer';
import Head from 'next/head';
import { siteName } from '../utils/config';
import axios from 'axios';
import { Store } from './Store';
import { signout } from '../utils/actions';
import Cookies from 'js-cookie';

function Layout({ children, title = 'Home', setSearchTerm, searchTerm }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  const theme = createMuiTheme({
    typography: {
      h1: {
        fontSize: '1.8rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h3: {
        fontSize: '1.4rem',
        fontWeight: 600,
        margin: '1rem 0',
      },

      navButton: {
        fontFamily: 'Pacifico',
        fontSize: '1rem',
        textTransform: 'none',
        color: 'white',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  useEffect(() => {
    const checkUser = async () => {
      if (state.userInfo) {
        try {
          await axios.get(`/api/users/check/${state.userInfo._id}`);
        } catch (error) {
          signout(dispatch);
        }
      }
    };
    checkUser();
  }, []);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${title} - ${siteName}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar
          darkMode={darkMode}
          onDarkModeChanged={() => {
            dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
            Cookies.set('darkMode', darkMode ? 'OFF' : 'ON');
          }}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
        <Container component="main" className={classes.main}>
          {children}
        </Container>
        <Footer />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default Layout;
