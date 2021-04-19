import React, { useEffect } from 'react';
import '../styles/globals.css';
import 'nprogress/nprogress.css';
import { StoreProvider } from '../components/Store';
import Router from 'next/router';
import nProgress from 'nprogress';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SnackbarProvider } from 'notistack';

// binding events
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());
function MyApp({ Component, pageProps }) {
  const mobile = useMediaQuery('(max-width: 580px)');
  const tablet = useMediaQuery('(max-width: 991px)');
  const desktop = useMediaQuery('(min-width: 992px)');

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StoreProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        maxSnack={3}
      >
        <Component {...pageProps} deviceType={{ mobile, tablet, desktop }} />
      </SnackbarProvider>
    </StoreProvider>
  );
}

export default MyApp;
