import { Alert } from '@material-ui/lab';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography,
  List,
  ListItem,
  Slide,
  FormControl,
  InputLabel,
  NativeSelect,
  Paper,
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
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FileUploader from '../../../components/FileUploader';
import Select from 'react-select';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

function Product({ params }) {
  const classes = useStyles();
  const productId = params.id;

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [featured, setFeatured] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [countInStock, setCountInStock] = useState(0);
  const [selectedTab, setSelectedTab] = useState('write');
  const [cities, setCities] = useState([]);
  const [successDelete, setSuccessDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    loading,
    error,
    product,
    loadingUpdate,
    errorUpdate,
    successUpdate,
    loadingInit,
    errorInit,
    cities: allCities,
    uploady,
    loadingSubcategories,
    errorSubcategories,
    subcategories
  } = state;

  const fecthInit = async () => {
    dispatch({ type: 'INIT_LIST_REQUEST' });
    try {
      const { data } = await Axios.get(`/api/products/init`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'INIT_LIST_SUCCESS', payload: data });
    } catch (err) {
      dispatch({
        type: 'INIT_LIST_FAIL',
        payload: getErrorMessage(err),
      });
    }
  };

  

  const fecthSubcategories = async () => {
    dispatch({ type: 'DEPARTMENT_SUB_CATEGORIES_LIST_REQUEST' });
    try {
      const { data } = await Axios.get(`/api/departments/sub-categories`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DEPARTMENT_SUB_CATEGORIES_LIST_SUCCESS', payload: data });
    } catch (err) {
      dispatch({
        type: 'DEPARTMENT_SUB_CATEGORIES_LIST_FAIL',
        payload: getErrorMessage(err),
      });
    }
  };

  useEffect(() => {
    if (uploady.imageType) {
      uploady.imageType === 'main'
        ? setImage(uploady.imageUrl)
        : setImages([...images, uploady.imageUrl]);
      return;
    }
    if (!userInfo) {
      return Router.push('/signin');
    }

    const fecthProduct = async () => {
      dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'PRODUCT_DETAILS_FAIL',
          payload: getErrorMessage(err),
        });
      }
    };
    if (product) {
      setId(product._id);
      setCities(product.cities.map((x) => ({ label: x, value: x })));
      setName(product.name);
      setPrice(product.price);
      setBuyPrice(product.buyPrice);
      setFeatured(product.featured);
      setOldPrice(product.oldPrice);
      setDiscount(product.discount);
      setImage(product.image);
      setImages(product.images);
      setDepartment(product.department);
      setCategory(product.category);
      setSubCategory(product.subcategory);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    } else {
      fecthProduct();
      fecthInit();
      fecthSubcategories()
    }
   
  }, [product, uploady]);

 

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'PRODUCT_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/products/${product._id}`,
        {
          name,
          price,
          department,
          category,
          subcategory,
          cities: cities.map((x) => x.value),
          brand,
          image,
          countInStock,
          description,
          buyPrice,
          oldPrice,
          discount,
          featured,
          images,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PRODUCT_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/products');
    } catch (error) {
      dispatch({
        type: 'PRODUCT_UPDATE_FAIL',
        payload: getErrorMessage(error),
      });
    }
  };

  const onUploadComplete = (imageUrl) => {
    setImages([...images, imageUrl]);
  };

  const onUploadMainImageComplete = (imageUrl) => {
    setImage([...image, imageUrl]);
  };

  const deleteImageHandler = async (imagedeleteId) => {
    if (window.confirm('Are you sure?')) {
      dispatch({ type: 'ADDITIONAL_IMAGE_DELETE_REQUEST' });
      setLoadingDelete(true);
      try {
        const { data } = await Axios.delete(
          `/api/products/${product._id}/imagedelete/${encodeURIComponent(
            imagedeleteId
          )}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'ADDITIONAL_IMAGE_DELETE_SUCCESS', payload: data });
        setSuccessDelete(true);
        setLoadingDelete(false);
        Router.push(`/admin/products/${data.product._id}`);
      } catch (error) {
        dispatch({
          type: 'ADDITIONAL_IMAGE_DELETE_FAIL',
          payload: getErrorMessage(error),
        });
      }
    }
  };

  function selectTheme(theme) {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'orange',
        primary: 'green',
      },
    };
  }

  const subcategoryChangeHandler = (value) => {
    const parts = value.value.split(' → ');
    setDepartment(parts[0]);
    setCategory(parts[1]);
    setSubCategory(parts[2]);
  };

  return (
    <Layout title="Edit Product">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <AdminSidebar selected="products" />
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper className={classes.p1}>
              <Slide direction="up" in={true}>
                <form className={classes.form} onSubmit={submitHandler}>
                  {product && (
                    <Typography component="h4" variant="h4">
                      {id
                        ? `   Catalog › Edit Product › ${product.name}(Product Id: ${product._id})`
                        : 'Create Product'}
                    </Typography>
                  )}
                  <hr />

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
                    label="Price"
                    name="price"
                    value={price}
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Old Price"
                    name="oldPrice"
                    value={oldPrice}
                    type="number"
                    onChange={(e) => setOldPrice(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Buy Price"
                    name="buyPrice"
                    value={buyPrice}
                    type="number"
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Discount"
                    name="discount"
                    value={discount}
                    type="number"
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Product Type
                    </InputLabel>
                    <NativeSelect
                      value={featured}
                      onChange={(e) => setFeatured(Number(e.target.value))}
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <option value={0}>No</option>
                      <option value={1}>Recommended</option>
                      <option value={2}>Featured</option>
                      <option value={3}>Super Featured</option>
                    </NativeSelect>
                  </FormControl>

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Main Image"
                    name="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />

                  <FileUploader
                    onUploadMainImageComplete={onUploadMainImageComplete}
                    caption="Upload Main Image"
                    imageType="main"
                  ></FileUploader>

                  <FormControl className={classes.formControl} fullWidth>
                    <InputLabel>Additional Images</InputLabel>

                    <List className={classes.list}>
                      {images && images.length === 0 ? (
                        <Typography variant="body1">No Image</Typography>
                      ) : (
                        images.map((imagedelete) => (
                          <ListItem key={imagedelete}>
                            <Button
                              onClick={() => deleteImageHandler(imagedelete)}
                            >
                              <HighlightOffIcon />
                            </Button>
                            <span>{imagedelete}</span>
                          </ListItem>
                        ))
                      )}
                    </List>
                    <FileUploader
                      onUploadComplete={onUploadComplete}
                      caption="Upload Additinal Image"
                      imageType="aditional"
                    ></FileUploader>
                  </FormControl>
                  <Box>
                    {loadingDelete && <CircularProgress></CircularProgress>}
                    {successDelete && (
                      <Alert severity="success">
                        Image deleted successfully.
                      </Alert>
                    )}
                  </Box>

                  {/* <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  /> */}

                {loadingSubcategories ? (
                    <CircularProgress></CircularProgress>
                  ) : errorSubcategories ? (
                    <Alert severity="error">{errorSubcategories}</Alert>
                  ) : (
                    <Box>
                      <Box className={classes.inputLabel}>
                      Category *
                      </Box>
                      <Select
                            options={subcategories.map((x) => ({
                              label: `${x.name} → ${x.category} → ${x.subcategory}`,
                              value: `${x.name} → ${x.category} → ${x.subcategory}`,
                              //value: `${x.category} → ${x.subcategory}`,
                            }))}
                            onChange={subcategoryChangeHandler}
                            theme={selectTheme}
                            placeholder="type category"
                            noOptionsMessage={() => 'no category selected'}
                            isSearchable
                            value={[
                              `${department} → ${category} → ${subcategory}`,
                            ].map((x) => ({ label: x, value: x }))}
                          />
                    </Box>
                  )}


                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Brand"
                    name="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Count in stock"
                    name="countInStock"
                    value={countInStock}
                    type="number"
                    onChange={(e) => setCountInStock(e.target.value)}
                  />

                  {loadingInit ? (
                    <CircularProgress></CircularProgress>
                  ) : errorInit ? (
                    <Alert severity="error">{errorInit}</Alert>
                  ) : (
                    <Box>
                      <Box className={classes.inputLabel}>
                        Avalivable Cities *
                      </Box>
                      {allCities && (
                        <Select
                          options={allCities.map((x) => ({
                            label: x.name,
                            value: x.name,
                          }))}
                          onChange={setCities}
                          theme={selectTheme}
                          placeholder="Available Cities"
                          noOptionsMessage={() =>
                            'Other Cities are not available currently'
                          }
                          isMulti
                          isSearchable
                          value={cities}
                        />
                      )}
                    </Box>
                  )}

                  <Box>
                    <Box className={classes.inputLabel}>Description</Box>
                    <ReactMde
                      value={description}
                      onChange={setDescription}
                      selectedTab={selectedTab}
                      onTabChange={setSelectedTab}
                      generateMarkdownPreview={(markdown) =>
                        Promise.resolve(converter.makeHtml(markdown))
                      }
                      childProps={{
                        writeButton: {
                          tabIndex: -1,
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={[classes.submit, classes.inputLabel]}
                  >
                    {id ? 'Update' : 'Create'}
                  </Button>
                  <Box>
                    {loadingUpdate && <CircularProgress></CircularProgress>}
                    {errorUpdate && (
                      <Alert severity="error">{errorUpdate}</Alert>
                    )}
                    {successUpdate && (
                      <Alert severity="success">
                        Profile updated successfully.
                      </Alert>
                    )}
                  </Box>
                </form>
              </Slide>
            </Paper>
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

export default dynamic(() => Promise.resolve(Product), {
  ssr: false,
});
