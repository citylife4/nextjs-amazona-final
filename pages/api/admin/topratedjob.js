import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import { isAuth, isAdmin,setTopratedProducts } from '../../../utils/auth';


const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const products = await setTopratedProducts();
    const topRatedproducts =  products.map((x) => ({
      _id: x._id,
      name: x.name,
      rating: x.rating,
      isToprated: x.isToprated,
    }))
    await db.disconnect();
    res.status(201).send(topRatedproducts)

  })

 

  export default handler;