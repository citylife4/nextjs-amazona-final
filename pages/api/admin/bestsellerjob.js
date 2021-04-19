import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import { isAuth, isAdmin,setBestSelleingProducts } from '../../../utils/auth';


const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const products = await setBestSelleingProducts();
    const bestSellingproducts =  products.map((x) => ({
      _id: x._id,
      name: x.name,
      sold: x.sold,
      isBestSeller: x.isBestSeller,
    }))
    await db.disconnect();
    res.status(201).send(bestSellingproducts)

  })

 
  export default handler;