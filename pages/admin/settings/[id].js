import { Alert } from '@material-ui/lab';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Checkbox,
  Slide,
  FormControl,
  FormControlLabel,
  InputLabel,
  NativeSelect,
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
import FileUploader from '../../../components/FileUploader';

function reducer(state, action) {
  switch (action.type) {
    case 'SETTING_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'SETTING_DETAILS_SUCCESS':
      return { ...state, loading: false, setting: action.payload };
    case 'SETTING_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'SETTING_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'SETTING_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'SETTING_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'SETTING_UPDATE_RESET':
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

function Setting({ params }) {
  const classes = useStyles();

  const settingId = params.id;

  const [
    { loading, error, setting, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const { state } = useContext(Store);
  const { userInfo,uploady } = state;

  

  const [isActive, setIsActive] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    if (uploady.imageType) {
      uploady.imageType === 'logo'
        && setSiteLogo(uploady.imageUrl)
      return;
    }

    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthSetting = async () => {
      dispatch({ type: 'SETTING_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/admin/setting/${settingId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'SETTING_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'SETTING_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (setting) {
      setSiteName(setting.siteName);
      setSiteLogo(setting.siteLogo);
      setPageSize(setting.pageSize);
      setTheme(setting.theme);
      setIsActive(setting.isActive);
    } else {
      fecthSetting();
    }
  }, [setting,uploady]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SETTING_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/admin/setting/${setting._id}`,
        { siteName,siteLogo,pageSize,isActive,theme },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'SETTING_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/settings');
    } catch (error) {
      dispatch({
        type: 'SETTING_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const onUploadLogoImageComplete= (imageUrl) => {
    setSiteLogo([...siteLogo, imageUrl]);
  };

  return (
    <Layout title="Edit Coupon">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="cities" />
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
                  <Typography component="h4" variant="h4">
                    Catalog &rsaquo; Edit Setting &rsaquo; {setting._id}
                  </Typography>
                  <hr />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Site Name"
                    name="siteName"
                    autoFocus
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />

                   <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Logo"
                    name="siteLogo"
                    value={siteLogo}
                    onChange={(e) => setSiteLogo(e.target.value)}
                  />

                  <FileUploader
                    onUploadLogoImageComplete={onUploadLogoImageComplete}
                    caption="Upload Main Image"
                    imageType="logo"
                  ></FileUploader>

                    <div>
                    <img src={siteLogo} alt="logo" className={classes.imageSmall}/>
                   </div>  

                   <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Page Size"
                    name="pageSize"
                    autoFocus
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                  />

               <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Theme
                    </InputLabel>
                    <NativeSelect
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <option>Select..</option>
                       <option>light</option>
                       <option>dark</option>
                    </NativeSelect>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        value="admin"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Is Active"
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
                        Setting updated successfully.
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

export default dynamic(() => Promise.resolve(Setting), {
  ssr: false,
});
