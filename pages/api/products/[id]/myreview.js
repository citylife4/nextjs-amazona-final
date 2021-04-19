import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).get(async (req, res) => {
  await db.connect();
  const userId = req.user._id;
  const productId = req.query.id;
  const product = await Product.findById(productId);
  await db.disconnect();
  if (product) {
    const userReview = product.reviews.find((review) => review.user == userId);
    if (userReview) {
      res.send({ message: 'review found', review: userReview });
    } else {
      res.send({ message: 'review not found' });
    }
  } else {
    res.send({ message: 'product not found' });
  }
});
export default handler;
