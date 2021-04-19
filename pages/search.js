import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Rating from '@material-ui/lab/Rating';
import {
  List,
  ListItem,
  Grid,
  Typography,
  Button,
  Box,
  MenuItem,
  Select,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import db from '../utils/db';
import Product from '../models/Product';
import City from '../models/City';
import { filterSearch } from '../utils/filterSearch';
import ProductCard from '../components/ProductCard';
import { PAGE_SIZE } from '../utils/config';
import { prices } from '../utils/FixedPrices';
import { ratings } from '../utils/FixedRates';
import { useStyles } from '../utils/styles';
import NextPagination from '../components/NextPagination';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';



export default function Search(props) {
  const classes = useStyles();
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    subcategory='all',
    department='all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    city = 'all',
    order = 'featured',
  } = router.query;
  const [products, setProducts] = useState(props.products);
  const { categories, brands, pages,allCities,departments,subcategories } = props;
  
 

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  const handleDepartment = (e) => {
    filterSearch({ router, department: e.target.value });
  };


  const handleCategory = (e) => {
    filterSearch({ router, category: e.target.value });
  };

  const handleSubCategory = (e) => {
    filterSearch({ router, subcategory: e.target.value });
  };

  const handleBrand = (e) => {
    filterSearch({ router, brand: e.target.value });
  };

  const handleSort = (e) => {
    filterSearch({ router, order: e.target.value });
  };

  const handlePrice = (e) => {
    filterSearch({ router, price: e.target.value });
  };

  const handleRating = (e) => {
    filterSearch({ router, rating: e.target.value });
  };

  const handleCities = (e) => {
    filterSearch({ router, city: e.target.value });
  };

 
  return (
    <Layout title="Search">
      <Grid container spacing={1}>
        <Grid item md={3}>
          <List>

          <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Departments</Typography>

                <Select fullWidth value={department} onChange={handleDepartment}>
                  <MenuItem value="all">All</MenuItem>
                  {departments &&
                    departments.map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Categories</Typography>

                <Select fullWidth value={category} onChange={handleCategory}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>

            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Subcategories</Typography>
                <Select fullWidth value={subcategory} onChange={handleSubCategory}>
                  <MenuItem value="all">All</MenuItem>
                  {subcategories &&
                    subcategories.map((subcategory) => (
                      <MenuItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>

            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Brands</Typography>
                <Select value={brand} onChange={handleBrand} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Prices</Typography>
                <Select value={price} onChange={handlePrice} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices &&
                    prices.map((price) => (
                      <MenuItem key={price.value} value={price.value}>
                        {price.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography variant="h3">Ratings</Typography>
                <Select value={rating} onChange={handleRating} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings &&
                    ratings.map((rating) => (
                      <MenuItem
                        dispaly="flex"
                        key={rating.rating}
                        value={rating.rating}
                      >
                        <Rating value={rating.rating} readOnly />
                        <Typography component="span">& Up</Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
            <Box className={classes.fullWidth}>
            <Typography variant="h3">City</Typography>
            <Select value={city} onChange={handleCities} fullWidth>
               <MenuItem value="all">All</MenuItem>
               {allCities &&
                    allCities.map((city) => (
                      <MenuItem
                        dispaly="flex"
                        key={city.name}
                        value={city.name}
                      >
                        {city.name}
                      </MenuItem>
                    ))}
              </Select>
              </Box>
              </ListItem>
          </List>
        </Grid>

        <Grid item md={9}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? 'No' : products.length} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {department !== 'all' && ' : ' + department}
              {category !== 'all' && ' : ' + category}
              {subcategory !== 'all' && ' : ' + subcategory}
              {brand !== 'all' && ' : ' + brand}
              {price !== 'all' && ' : Price ' + price}
              {city !== 'all' && ' : City ' + city}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              department  !== 'all' ||
              subcategory  !== 'all' ||
              brand !== 'all' ||
              rating !== 'all' ||
              city !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>
                   <HighlightOffIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                component="span"
                className={classes.strong}
              >
                Sort
              </Typography>

              <Select value={order} onChange={handleSort}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Avg. Customer Reviews</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={3} className={classes.mt1}>
            {products.map((product) => (
              <ProductCard key={product._id} gridSize={4} product={product} />
            ))}
          </Grid>
          <NextPagination
            prefix="/search1"
            className={classes.mt1}
            totalPages={pages}
          ></NextPagination>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const department = query.department || '';
  const category = query.category || '';
  const subcategory = query.subcategory || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const orderType = query.order || '';
  const searchQuery = query.query || 'all';
 

  const searchFilter =
    searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};


  const departmentFilter = department && department !== 'all' ? { department } : {};    
  const subCategoryFilter = subcategory && subcategory !== 'all' ? { subcategory } : {};    
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};


  const order =
    orderType === 'featured'
      ? { featured: -1 }
      : orderType === 'lowest'
      ? { price: 1 }
      : orderType === 'highest'
      ? { price: -1 }
      : orderType === 'toprated'
      ? { rating: -1 }
      : orderType === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };


     
  const departments = await Product.find().distinct('department');
  const subcategories = await Product.find().distinct('subcategory');
  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');

  const cityFilter =
      query.city && query.city !== 'all'
        ? { cities:query.city }
        : {};

 

  const productDocs = await Product.find({
    ...searchFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
    ...cityFilter,
    ...departmentFilter,
    ...subCategoryFilter
  })
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...searchFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
    ...cityFilter,
    ...departmentFilter,
    ...subCategoryFilter
  });

  

  const allCities = await City.find({})
  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);

  

  return {
    props: {
      products,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
      subcategories,
      departments,
      allCities:JSON.parse(JSON.stringify(allCities)),
       
    },
  };
}
