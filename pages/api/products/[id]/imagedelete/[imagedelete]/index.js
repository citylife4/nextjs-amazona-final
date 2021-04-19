import nextConnect from 'next-connect';
import { onError } from '../../../../../../utils/error';
import db from '../../../../../../utils/db';
import Product from '../../../../../../models/Product';
import { isAdmin, isAuth } from '../../../../../../utils/auth';

const handler = nextConnect({
  onError,
})
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
      const image = product.images.find(
        (x) => x == decodeURIComponent(req.query.imagedelete)
      );

      if (image) {
        await Product.updateOne(
          { _id: req.query.id },
          { $pull: { images: decodeURIComponent(req.query.imagedelete) } }
        );

        await db.disconnect();
        res.send({ message: 'Image Deleted' });
      } else {
        res.status(404).send({ message: 'Image Not Found' });
        await db.disconnect();
      }
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Product Not Found' });
    }
  });

export default handler;
