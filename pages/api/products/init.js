import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import City from '../../../models/City';
import Product from '../../../models/Product';
import Department from '../../../models/Department';
import Setting from '../../../models/Setting';

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const departments = await Department.find({ isDeleted: false });
  const categories = await Product.find().distinct('category');
  const subcategories = await Product.find().distinct('subcategory');
  const brands = await Product.find().distinct('brand');
  const cities = await City.find();
  const setting = await Setting.findOne({ isActive: true });
  await db.disconnect();
  res.send({
    cities,
    departments,
    categories,
    subcategories,
    brands,
    setting: setting || {
      siteName: 'amazona',
      siteLogo: '/images/logo.png',
      theme: 'light',
    },
  });
});

export default handler;
