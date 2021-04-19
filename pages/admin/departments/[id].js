import { Alert } from '@material-ui/lab';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Slide,
  InputLabel,
  ListItem,
  List,
  Divider
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
import EditIcon from '@material-ui/icons/Edit';


function reducer(state, action) {
  switch (action.type) {
    case 'DEPARTMENT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'DEPARTMENT_DETAILS_SUCCESS':
      return { ...state, loading: false, department: action.payload };
    case 'DEPARTMENT_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DEPARTMENT_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'DEPARTMENT_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'DEPARTMENT_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'DEPARTMENT_UPDATE_RESET':
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

function Department({ params }) {
  const classes = useStyles();

  const departmentId = params.id;

  const [
    { loading, error, department, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [departmentName, setDepartmentName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthDepartment = async () => {
      dispatch({ type: 'DEPARTMENT_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/departments/${departmentId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DEPARTMENT_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'DEPARTMENT_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (department) {
      // setDepartmentName(department.name);
      //categoryname();
      //subCategoryname();
    } else {
      fecthDepartment();
    }
  }, [department]);



  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'DEPARTMENT_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/departments/${department._id}`,
        { departmentName,categoryName,subcategoryName },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DEPARTMENT_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/departments');
    } catch (error) {
      dispatch({
        type: 'DEPARTMENT_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  

  

  const handleChangeDepartment = ()=>{
   setDepartmentName(department.name)
  }
 


  const handleChangeCategory = async(categoryId)=>{

      dispatch({ type: 'CATEGORY_FETCH_REQUEST' });
      try {
        const { data } = await Axios.get(
          `/api/departments/${department._id}/categories/${categoryId}`,
         
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'CATEGORY_FETCH_SUCCESS', payload: data });
        setCategoryName(data.name)
      } catch (error) {
        dispatch({
          type: 'CATEGORY_FETCH_FAIL',
          payload: getErrorMessage(error),
        });
      }
   }

   const handleChangeSubCategory = async(subCategoryId)=>{

    dispatch({ type: 'SUBCATEGORY_FETCH_REQUEST' });
    try {
      const { data } = await Axios.get(
        `/api/departments/${department._id}/subcategory/${subCategoryId}`,
       
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'SUBCATEGORY_FETCH_SUCCESS', payload: data });
      setSubCategoryName(data.name)
    } catch (error) {
      dispatch({
        type: 'SUBCATEGORY_FETCH_FAIL',
        payload: getErrorMessage(error),
      });
    }
 }

 console.log(subCategoryName);


  return (
    <Layout title="Edit Coupon">
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
            <React.Fragment>
              <Slide direction="up" in={true}>
                <form className={classes.form} onSubmit={submitHandler}>
                  <Typography component="h3" variant="h3">
                    Catalog &rsaquo; Edit department &rsaquo; {department.name}
                  </Typography>
                  <hr />

                  <Box>
                  <InputLabel id="demo-simple-select-label">Department</InputLabel>
                    <List>
                      <ListItem>
                        {department.name}
                         <EditIcon 
                         style={{ color:"orange", margin:"1rem", cursor:"pointer"}} 
                         onClick={handleChangeDepartment}
                         />
                      </ListItem>
                    </List>
                  </Box>

                

              <Box>
                 <InputLabel id="demo-simple-select-label">Department &rsaquo; Categories</InputLabel>
               <List>
                 {department && department.categories.map((c)=>(
                        <ListItem key={c._id}>{c.name}
                        <EditIcon 
                        onClick={()=>handleChangeCategory(c._id)}
                        style={{ color:"orange", margin:"1rem",cursor:"pointer"}}
                         />
                        </ListItem>
                        
                ))}
               </List>
              </Box>

              <Box>
                 <InputLabel id="demo-simple-select-label">Department &rsaquo; Categories &rsaquo; Subcategories</InputLabel>
               <List>
                 {department && department.categories.map((c)=>(
                        <div>
                          {c.subcategories.map((s)=>(
                        <ListItem key={s._id}>{s.name} 
                        <EditIcon 
                        onClick={()=>handleChangeSubCategory(s._id)}
                        style={{ color:"orange", margin:"1rem",cursor:"pointer"}} /></ListItem>
                        ))}
                        </div>
                        
                ))}
               </List>
              </Box>
             
                <Typography variant="h3">Update</Typography>
                
               
                 <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    label="Department"
                    name="name"
                    autoFocus
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  /> 

                   <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Category"
                    name="categoryName"
                    autoFocus
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  /> 

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="sub-category"
                    name="subCategoryName"
                    autoFocus
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
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
                        Department updated successfully.
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

export default dynamic(() => Promise.resolve(Department), {
  ssr: false,
});
