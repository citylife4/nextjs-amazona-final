import React from 'react';
import NextLink from '../components/NextLink';
import Rating from '@material-ui/lab/Rating';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActionArea,
  Slide,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { curr } from '../utils/config';

function ProductCard({ product, gridSize = 12, hideBadge = false }) {
  const classes = useStyles();

  const showBadge =
    !hideBadge &&
    (product.isBestSeller ||
      product.isDiscounted ||
      product.isTopRated ||
      product.isRecommended ||
      product.isFeatured);

  return (
    <Slide direction="up" in={true}>
      <Grid item md={gridSize} xs={12}>
        <Card className={classes.thumbnail}>
          <NextLink href={`/products/${product.slug}`} className={classes.link}>
            <CardActionArea>
              {showBadge && (
                <Box className={classes.badge}>
                  {product.isBestSeller
                    ? 'Best Seller'
                    : product.isTopRated
                    ? 'Top Rated'
                    : product.isRecommended
                    ? 'Recommended'
                    : product.isFeatured
                    ? 'Featured'
                    : product.isDiscounted
                    ? 'Discount'
                    : ''}
                </Box>
              )}

              <img
                src={product.image}
                alt={product.name}
                className={classes.thumbnailImage}
              />

              <CardContent>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="textPrimary"
                  component="p"
                  className={classes.productName}
                >
                  {product.name}
                </Typography>
                <Box className={classes.cardFooter}>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {product.brand}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="p">
                    <span className={classes.price}>
                      {' '}
                      {curr}
                      {product.price}
                    </span>
                    {product.oldPrice !== 0 &&
                      product.oldPrice !== product.price && (
                        <span className={classes.oldPrice}>
                          {curr}
                          {product.oldPrice}
                        </span>
                      )}
                  </Typography>
                </Box>
                <Box>
                  <Rating value={product.rating} readOnly />
                </Box>
              </CardContent>
            </CardActionArea>
          </NextLink>
        </Card>
      </Grid>
    </Slide>
  );
}

export default ProductCard;
