import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Box,
  Card,
  Select,
  MenuItem,
  Button,
  Slide,
  CircularProgress,
  CardActionArea,
  Divider,
  Grow,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useStyles } from '../../utils/styles';
import Rating from '@material-ui/lab/Rating';
import { Alert } from '@material-ui/lab';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Router from 'next/router';
import { Store } from '../../components/Store';
import { CART_ADD_ITEM, WISH_ADD_ITEM } from '../../utils/constants';
import { curr } from '../../utils/config';
import db from '../../utils/db';
import Product from '../../models/Product';
import Axios from 'axios';
import { getErrorMessage } from '../../utils/error';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { toast, ToastContainer } from 'react-nextjs-toast';
import MarkdownView from 'react-showdown';
import { useRouter } from 'next/router';
import HomeProductCard from '../../components/HomeProducts';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import TextareaAutosize from 'react-textarea-autosize';
import ProductCard from '../../components/ProductCard';

export default function ProductScreen({ product }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const query = router.query;
  if (product.category) query.category = product.category;
  if (product.brand) query.brand = product.brand;

  const [image, setImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewMode, setReviewMode] = useState('CREATE');

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);
  const [errorRelatedProducts, setErrorRelatedProducts] = useState(false);

  const addToCartHandler = async ({ redirectToCart }) => {
    const { data } = await Axios.get(`/api/products/${product._id}`);

    if (data.countInStock <= 0) {
      enqueueSnackbar('Sorry. This product is out of stock.', {
        variant: 'error',
      });
    } else {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          product: product._id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          quantity,
        },
      });

      if (redirectToCart) {
        enqueueSnackbar('Product added to the cart.', {
          variant: 'success',
        });
        Router.push('/cart');
      } else {
        enqueueSnackbar('Product added to the cart.', {
          variant: 'success',
          action: (
            <Button
              onClick={() => {
                Router.push('/cart');
                closeSnackbar();
              }}
            >
              View Cart
            </Button>
          ),
        });
      }
    }
  };

  const addToWishHandler = () => {
    dispatch({
      type: WISH_ADD_ITEM,
      payload: {
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity,
      },
    });
    Router.push('/wish');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      toast.notify(data.message, {
        duration: 5,
        type: 'success',
      });
      fetchReviews();
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await Axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const getRelatedProducts = async () => {
    setLoadingRelatedProducts(true);
    try {
      const { data } = await Axios.get(`/api/products/${product._id}/related`);
      setRelatedProducts(data);
      setLoadingRelatedProducts(false);
    } catch (error) {
      setLoadingRelatedProducts(false);
      setErrorRelatedProducts(getErrorMessage(error));
    }
  };

  const fillUserReview = async () => {
    const { data } = await Axios.get(`/api/products/${product._id}/myreview`, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });
    if (data.review) {
      setComment(data.review.comment);
      setRating(data.review.rating);
      setReviewMode('UPDATE');
    }
  };

  useEffect(() => {
    fetchReviews();
    getRelatedProducts();
    if (userInfo) {
      fillUserReview();
    }
  }, []);

  const slidesRelatedProduct = relatedProducts?.map((product) => (
    <SwiperSlide
      key={product._id}
      tag="li"
      style={{ listStyle: 'none' }}
      className={classes.swiperslide}
    >
      <Grow in>
        <Grid container spacing={5}>
          <ProductCard gridSize={12} hideBadge product={product} />
        </Grid>
      </Grow>
      {/* <HomeProductCard key={product._id} product={product} /> */}
    </SwiperSlide>
  ));

  const handleClickCatergory = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: query,
    });
  };

  const handleClickBrand = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: query,
    });
  };

  return (
    <Layout title={product.name}>
      <Box display="flex">
        <Typography
          style={{ cursor: 'pointer', marginRight: '0.5rem' }}
          onClick={handleClickCatergory}
        >
          {product.category}
        </Typography>
        &rsaquo;
        <Typography
          style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
          onClick={handleClickBrand}
        >
          {product.brand}
        </Typography>
      </Box>

      <hr />

      <Slide
        key={product.name}
        className={classes.pading}
        direction="up"
        in={true}
      >
        <Grid container spacing={1}>
          <Grid item md={6}>
            <TransformWrapper
              defaultScale={1}
              defaultPositionX={100}
              defaultPositionY={200}
            >
              {({ zoomIn, zoomOut, ...rest }) => (
                <>
                  <Box margin="0.5rem">
                    <Button variant="outlined" onClick={zoomIn}>
                      <ZoomInIcon fontSize="large" color="action" />
                    </Button>
                    <Button variant="outlined" onClick={zoomOut}>
                      <ZoomOutIcon fontSize="large" color="secondary" />
                    </Button>
                  </Box>

                  <TransformComponent>
                    <img
                      className={classes.largeImage}
                      src={image || product.image}
                      alt={product.name}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>

            <Swiper
              breakpoints={{
                640: {
                  width: 640,
                  slidesPerView: 1,
                },

                768: {
                  width: 768,
                  slidesPerView: 3,
                },
              }}
              id="main"
              width="480"
              spaceBetween={5}
              slidesPerView={1}
            >
              <Grid container spacing={1}>
                {[product.image, ...product.images].map((x) => (
                  <Grid item key={x}>
                    <SwiperSlide>
                      <Card
                        onClick={() => setImage(x)}
                        className={classes.additionalImage}
                      >
                        <CardActionArea>
                          <img
                            src={x}
                            alt={product.name}
                            style={{
                              height: '100px',
                            }}
                          />
                        </CardActionArea>
                      </Card>
                    </SwiperSlide>
                  </Grid>
                ))}
              </Grid>
            </Swiper>
          </Grid>

          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography
                  gutterBottom
                  variant="h3"
                  color="textPrimary"
                  component="h3"
                >
                  {product.name}
                  <NextLink href="/wish">
                    <FavoriteBorderIcon
                      style={{ color: 'green', cursor: 'pointer' }}
                      onClick={addToWishHandler}
                    />
                  </NextLink>
                </Typography>
              </ListItem>

              <ListItem>
                <Rating
                  name="simple-controlled"
                  value={product.rating}
                  readOnly
                />
                {product.numReviews === 1 ? (
                  <Box ml={2}>{`${product.numReviews} review`}</Box>
                ) : (
                  <Box ml={2}>{`${product.numReviews} reviews`}</Box>
                )}
              </ListItem>

              {/* <Typography component="h2">Description:</Typography> */}
              <ListItem>
                <MarkdownView
                  markdown={product.description}
                  options={{ tables: true, emoji: true }}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={classes.card}>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Price
                    </Grid>
                    <Grid item xs={6}>
                      {curr}
                      {product.price}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid alignItems="center" container>
                    <Grid item xs={6}>
                      Status
                    </Grid>
                    <Grid item xs={6}>
                      {product.countInStock > 0 ? (
                        <Alert icon={false} severity="success">
                          In Stock
                        </Alert>
                      ) : (
                        <Alert icon={false} severity="error">
                          Unavailable
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>

                {product.countInStock > 0 && (
                  <>
                    <ListItem>
                      <Grid container justify="flex-end">
                        <Grid item xs={6}>
                          Quantity
                        </Grid>
                        <Grid item xs={6} className={classes.textRight}>
                          <Select
                            labelId="quanitity-label"
                            id="quanitity"
                            fullWidth
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          addToCartHandler({ redirectToCart: false })
                        }
                      >
                        Add to cart
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          addToCartHandler({ redirectToCart: true })
                        }
                      >
                        Shop Now
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Slide>
      <br />
      <Divider light />
      <Box>
        <ToastContainer />

        <Typography id="reviews" variant="h6">
          Customer Reviews
        </Typography>
        <List>
          {reviews.map((review) => (
            <ListItem key={review._id}>
              <Grid container>
                <Grid item className={classes.reviewItem}>
                  <strong>{review.name}</strong>
                  <p>{review.createdAt.substring(0, 10)}</p>
                </Grid>
                <Grid item>
                  <Rating value={review.rating} readOnly></Rating>
                  <p>{review.comment}</p>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <ListItem>
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <Typography variant="h6">
                  {reviewMode === 'CREATE'
                    ? 'Review this product'
                    : 'Update your review'}
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />

                <TextareaAutosize
                  minRows={6}
                  maxRows={8}
                  defaultValue="Write a Review Here..."
                  className="textareaAutosize"
                  name="review"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {reviewMode === 'CREATE' ? 'Submit' : 'Update'}
                </Button>
                <Box>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && <Alert severity="error">{error}</Alert>}
                </Box>
              </form>
            ) : (
              <Alert>
                Please <Link href="/signin">Sign In</Link> to write a review
              </Alert>
            )}
          </ListItem>
        </List>
      </Box>
      <Divider light />
      <Box>
        <Typography component="h6" variant="h6" className={classes.pading1}>
          Compare Similar Products
        </Typography>
        {loadingRelatedProducts ? (
          <CircularProgress></CircularProgress>
        ) : errorRelatedProducts ? (
          <Alert severity="error">{errorRelatedProducts}</Alert>
        ) : (
          <>
            {!relatedProducts.length && (
              <Typography component="h7" variant="h7">
                No Related Products Available
              </Typography>
            )}

            <Box component="div">
              <Swiper
                breakpoints={{
                  640: {
                    width: 640,
                    slidesPerView: 2,
                  },

                  768: {
                    width: 768,
                    slidesPerView: 3,
                  },
                }}
                id="main"
                width="380"
                navigation
                className={classes.swiper}
                spaceBetween={10}
                slidesPerView={2}
              >
                {slidesRelatedProduct}
              </Swiper>
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  await db.connect();
  const productDoc = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();
  const product = db.convertDocToObj(productDoc);
  return { props: { product } };
}
