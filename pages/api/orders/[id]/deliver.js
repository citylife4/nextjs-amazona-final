import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import db from "../../../../utils/db";
import Order from '../../../../models/Order';
import { isAuth,isAdmin } from '../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler.use(isAuth,isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.transactions.push({
            user: req.user._id,
            userName: req.user.name,
            transactionType: 'DELIVERED',
          });
    
        const updatedOrder = await order.save();
        await db.disconnect()
        res.send({ message: 'Order Delivered', order: updatedOrder });
        res.send(order);
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Order Not Found' });
    }
})

export default handler;