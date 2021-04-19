import React from 'react';
import Carousel from 'react-material-ui-carousel';

import { useStyles } from '../utils/styles';

export default function Banner(props) {
  const defaultItems = [
    {
      caption: 'best product',
      image: '/images/banner1.jpg',
      description: 'best description',
      link: 'https://google.com',
    },
    {
      caption: 'best product',
      image: '/images/banner2.jpg',
      description: 'best description',
      link: 'https://google.com',
    },
  ];
  const { items } = props;
  const classes = useStyles();
  return (
    <Carousel animation="slide">
      {(items || defaultItems).map((item) => (
        <a key={item.caption} href={item.link}>
          <img
            src={item.image}
            alt={item.caption}
            className={classes.fullWidth}
          ></img>
        </a>
      ))}
    </Carousel>
  );
}
