import React from 'react';
import {Shirts} from '../utils/icons/Shirts';
import {Tops} from '../utils/icons/Tops';

function onClick (e, category) {
  window.alert (JSON.stringify (category, null, 2));
}

export const categories = [
  {
    name: 'mensfashion',
    label: 'Mens Fashion',
    Icon: Shirts,
    categories: [
      {name: 'shirts', label: 'Shirts', onClick},
      {name: 'pants', label: 'Pants', onClick},
    ],
  },
  {
    name: 'womensfashion',
    label: 'Womens Fashion',
    Icon: Tops,
    categories: [
      {name: 'tops', label: 'Tops', onClick},
      {name: 'palazo', label: 'Palazo', onClick},
    ],
  },
];
