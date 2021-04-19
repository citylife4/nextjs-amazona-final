import React from 'react';
import NextLink from '../components/NextLink';
import Image from 'next/image';
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

function HomeProductCard({ product, gridSize = 12, hideBadge = false }) {
  const classes = useStyles();

  return (
    <Slide direction="up" in={true}>
      <Grid item md={gridSize} xs={12} style={{ display: 'flex' }}>
        <Card>
          <NextLink href={`/products/${product.slug}`} className={classes.link}>
            <CardActionArea>
              <Image
                src={product.image}
                width={50}
                height={50}
                alt={product.name}
                layout="responsive"
                unoptimized
              />

              <CardContent>
                <Typography
                  gutterBottom
                  variant="h2"
                  className={classes.homeProductName}
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
                    {product.oldPrice !== 0 && (
                      <>
                        <span className={classes.oldPrice}>
                          {curr}
                          {product.oldPrice}
                        </span>

                        <span className={classes.save}>
                          Save {curr}
                          {product.oldPrice - product.price}
                        </span>
                      </>
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

export default HomeProductCard;
