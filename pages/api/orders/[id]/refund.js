import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import db from "../../../../utils/db";
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';

const handler = nextConnect({
    onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isRefunded  = true;
        order.refundedAt = Date.now();
        const updatedOrder = await order.save();
        order.transactions.push({
            user: req.user._id,
            userName: req.user.name,
            transactionType: 'REFUNDED',
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
              transactionType: 'REFUND',            
              description: `Refunded order ${updatedOrder._id}`,
            });
            
            await product.save();
          }
        await db.disconnect()
        res.send({ message: 'Order Refunded', order: updatedOrder });
        res.send(order);
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Order Not Found' });
    }
})

export default handler;