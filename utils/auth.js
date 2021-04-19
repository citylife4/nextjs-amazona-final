/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import mailGun from 'mailgun-js';
import Product from '../models/Product';

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token is not supplied' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const mailgun = mailGun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  host: process.env.MAILGUN_HOST,
});


export const setBestSelleingProducts = async () => {
  const bestSellerProducts = await Product.find({ isBestSeller: true });
  for (const product of bestSellerProducts) {
    product.isBestSeller = false;
    await product.save();
  }
  const products = await Product.find({ sold: { $gt: 0 } })
    .sort({ sold: -1 })
    .limit(10);
  for (const product of products) {
    product.isBestSeller = true;
    await product.save();
  }
  return products;
};


export const setDiscountedProducts = async () => {
  const discountedProducts = await Product.find({ isDiscounted: true });
  for (const product of discountedProducts) {
    product.isDiscounted = false;
    await product.save();
  }
  const products = await Product.find({ oldPrice: { $gt: 0 } })
    .sort({ oldPrice: -1 })
    .limit(10);
  for (const product of products) {
    product.isDiscounted = true;
    await product.save();
  }
  return products;
};


export const setTopratedProducts = async () => {
  const topratedProducts = await Product.find({ isToprated: true });
  for (const product of topratedProducts) {
    product.isToprated = false;
    await product.save();
  }
  const products = await Product.find({ rating: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(10);
  for (const product of products) {
    product.isToprated = true;
    await product.save();
  }
  return products;
};


