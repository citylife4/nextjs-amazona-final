/* eslint-disable no-undef */
import mongoose from 'mongoose';
import data from './data.js';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Setting from '../models/Setting.js';
import Coupon from '../models/Coupon.js';
import City from '../models/City.js';
import ShippingDistance from '../models/ShippingDistance.js';

dotenv.config();

const importData = async () => {
  console.log('import data');
  mongoose
    .connect(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log('successfully connected to db');
      try {
        // clean
        await Order.deleteMany();
        await Product.deleteMany();
        await Coupon.deleteMany();
        await Department.deleteMany();
        await City.deleteMany();
        await User.deleteMany();
        await Setting.deleteMany();
        await ShippingDistance.deleteMany();
        // fill
        await Setting.insertMany(data.settings);
        await ShippingDistance.insertMany(data.shippingDistances);
        const users = await User.insertMany(data.users);
        await City.insertMany(data.cities);
        await Department.insertMany(data.departments);
        await Coupon.insertMany(data.coupons);
        await Product.insertMany(
          data.products.map((x) => ({ ...x, seller: users[0]._id }))
        );
        await Order.insertMany(
          data.orders.map((x) => ({ ...x, user: users[1]._id }))
        );
        process.exit();
      } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
      }
    })
    .catch((e) => console.error(`error in connecting to db ${e}`));
};

const destroyData = async () => {
  console.log('destory data');
  mongoose
    .connect(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log('successfully connected to db');
      try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Department.deleteMany();
        await Setting.deleteMany();
        await Coupon.deleteMany();
        await City.deleteMany();
        process.exit();
      } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
      }
    })
    .catch((e) => console.error(`error in connecting to db ${e}`));
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
