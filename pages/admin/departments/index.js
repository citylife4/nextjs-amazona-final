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

function reducer(state, action) {
  switch (action.type) {
    case 'DEPARTMENT_LIST_REQUEST':
      return { ...state, loading: true };
    case 'DEPARTMENT_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        departments: action.payload,
        pages: action.payload,
      };
    case 'DEPARTMENT_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DEPARTMENT_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DEPARTMENT_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DEPARTMENT_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'DEPARTMENT_DELETE_RESET':
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

function Department(props) {
  const classes = useStyles();
  const [
    { loading, error, departments, loadingDelete, errorDelete, successDelete },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingDelete: false,
    successDelete: false,
    errorDelete: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { query = 'all' } = router.query;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthDepartments = async () => {
      dispatch({ type: 'DEPARTMENT_LIST_REQUEST', payload: { query: '' } });
      try {
        const { data } = await Axios.get(`/api/departments?query=${query}`);
        dispatch({ type: 'DEPARTMENT_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'DEPARTMENT_LIST_LIST_FAILL',
          payload: getErrorMessage(err),
        });
      }
    };
    fecthDepartments();
  }, [successDelete, query]);

  const deleteDepartmentHandler = async () => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'DEPARTMENT_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/department/${department._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DEPARTMENT_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'DEPARTMENT_DELETE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const createCityHandler = async () => {
    dispatch({ type: 'DEPARTMENT_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/departments`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DEPARTMENT_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/departments/${data.department._id}`);
    } catch (error) {
      dispatch({
        type: 'DEPARTMENT_CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };


  const createDepartmentHandler = async () => {
    dispatch({ type: 'DEPARTMENT_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/departments`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DEPARTMENT_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/departments/${data.department._id}`);
    } catch (error) {
      dispatch({
        type: 'DEPARTMENT_CREATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  return (
    <Layout title="Admin Cities">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="departments" />
        </Grid>
        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Typography component="h4" variant="h4">
                Catalog &rsaquo; Departments
              </Typography>
           
              <Grid
                container
                alignItems="center"
                className={classes.justifyContentSpaceBetween}
              >

               <Grid item>
                {departments.length === 0 ? 'No' : departments.length} Results:{' '}
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {query !== 'all' && query !== '' ? (
                    <Button onClick={() => router.push('/admin/cities')}>
                      <HighlightOffIcon /> 
                    </Button>
                  ) : null}

                </Grid>

                <Grid>
                  <form action="/admin/departments">
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search departments…"
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

                <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '5rem' }}
                  onClick={() => createDepartmentHandler()}
                >
                  Create Department
                </Button>

                  </Grid>
              </Grid>


              {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
              {loadingDelete && <CircularProgress />}
              {successDelete && (
                <Alert severity="success">Departments deleted successfully</Alert>
              )}

              <Slide direction="up" in={true}>
                <TableContainer>
                  <Table aria-label="Coupons">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {departments.map((department) => (
                        <TableRow key={department._id}>
                          <TableCell component="th" scope="row">
                            ...{department._id.substring(20, 24)}
                          </TableCell>
                          <TableCell>{department.name}</TableCell>
                          <TableCell>{department.categories.length}</TableCell>
                          <TableCell>
                            {department.createdAt.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/departments/${department._id}`}>
                              <Button>
                                <EditIcon style={{ color: 'orange', fontSize: 25 }} />
                              </Button>
                            </Link>
                            <Button onClick={() => deleteDepartmentHandler(department)}>
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

export default dynamic(() => Promise.resolve(Department), {
  ssr: false,
});
