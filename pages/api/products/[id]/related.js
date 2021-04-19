import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error'
import db from '../../../../utils/db'
import Product from '../../../../models/Product'


const handler = nextConnect({
    onError,
});

handler.get(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    
    if (product) {
        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            subcategory: product.subcategory,
        })
        await db.disconnect();
        res.status(201).send(relatedProducts)
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Related Product Not Found' });
    }

});
export default handler;