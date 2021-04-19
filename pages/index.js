import React from 'react';
import Layout from '../components/Layout';
import { Box, Grid, Grow, Typography } from '@material-ui/core';
import { useStyles } from '../utils/styles';
import Banner from '../components/Banner';
import SwiperCore, {
  Thumbs,
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper-bundle.min.css';
import Product from '../models/Product';
import Department from '../models/Department';
import db from '../utils/db';
import ProductCard from '../components/ProductCard';

SwiperCore.use([Thumbs, Navigation, Pagination, Scrollbar, Autoplay]);

export default function index({
  bestSellingProducts,
  topRatedProducts,
  featuredProducts,
}) {
  const classes = useStyles();

  //const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const slidesFeature = featuredProducts?.map((product) => (
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
    </SwiperSlide>
  ));

  const slidesTopRated = topRatedProducts?.map((product) => (
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
    </SwiperSlide>
  ));

  const slidesBestSellers = bestSellingProducts?.map((product) => (
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
    </SwiperSlide>
  ));

  return (
    <Layout title="Home">
      <Banner />
      <Box component="div">
        <Typography
          variant="h3"
          className={classes.textHeading}
          display="block"
          gutterBottom
        >
          Featured
        </Typography>

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
          width="380"
          className={classes.swiper}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          watchSlidesVisibility
          watchSlidesProgress
        >
          {slidesFeature}
        </Swiper>
      </Box>

      <Box component="div">
        <Typography
          variant="h3"
          className={classes.textHeading}
          display="block"
          gutterBottom
        >
          Top Rated
        </Typography>
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
          width="380"
          className={classes.swiper}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          watchSlidesVisibility
          watchSlidesProgress
        >
          {slidesTopRated}
        </Swiper>
      </Box>

      <Box component="div">
        <Typography
          variant="h3"
          className={classes.textHeading}
          display="block"
          gutterBottom
        >
          Best Sellers
        </Typography>
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
          width="380"
          className={classes.swiper}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          watchSlidesVisibility
          watchSlidesProgress
        >
          {slidesBestSellers}
        </Swiper>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const bestSellingProductsDocs = await Product.find({ isBestSeller: true })
    .lean()
    .sort({
      sold: -1,
    })
    .limit(8);
  const topRatedProductsDocs = await Product.find({ isToprated: true })
    .lean()
    .sort({
      rating: -1,
    })
    .limit(8);
  const featuredProductsDocs = await Product.find({ featured: 1 })
    .lean()
    .sort({
      featured: -1,
    })
    .limit(8);

  const departments = await Department.find({ isDeleted: false });
  const categories = await Product.find().distinct('category');
  const subcategories = await Product.find().distinct('subcategory');
  const brands = await Product.find().distinct('brand');

  await db.disconnect();
  const bestSellingProducts = bestSellingProductsDocs.map(db.convertDocToObj);
  const topRatedProducts = topRatedProductsDocs.map(db.convertDocToObj);
  const featuredProducts = featuredProductsDocs.map(db.convertDocToObj);

  return {
    props: {
      bestSellingProducts,
      topRatedProducts,
      featuredProducts,
      departments: JSON.parse(JSON.stringify(departments)),
      categories: JSON.parse(JSON.stringify(categories)),
      subcategories: JSON.parse(JSON.stringify(subcategories)),
      brands,
    },
  };
}
