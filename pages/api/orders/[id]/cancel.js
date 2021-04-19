import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import db from "../../../../utils/db";
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import { isAuth } from '../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isCanceled = true;
        order.canceledAt = Date.now();
        const updatedOrder = await order.save();
        order.transactions.push({
            user: req.user._id,
            userName: req.user.name,
            transactionType: 'CANCELED',
          });
          for (const index in updatedOrder.orderItems) {
            const item = updatedOrder.orderItems[index];
            const productP = await Product.findOne(item.product);
            const product = await Product.findById(productP);
            product.countInStock += item.quantity;
           
            product.sold -= item.quantity;
            product.transactions.push({
              user: req.user._id,
              qty: -item.quantity,
              transactionType: 'CANCELED',
    
            
              description: `Cancelled  order ${updatedOrder._id}`,
            });
            
            await product.save();
          }
        await db.disconnect()
        res.send({ message: 'Order Cancelled', order: updatedOrder });
        res.send(order);
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Order Not Found' });
    }
})

export default handler;