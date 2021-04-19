import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import db from "../../../../utils/db";
import Order from '../../../../models/Order';
import { isAuth,isAdmin,mailgun  } from '../../../../utils/auth';
import emailTemplates from '../../../../utils/emailTemplates';

const handler = nextConnect({
    onError,
});

handler.use(isAuth,isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {

        order.isSent= true;
        order.sentAt = Date.now();
        order.transactions.push({
          user: req.user._id,
          userName: req.user.name,
          transactionType: 'SENT',
        });
  
        const updatedOrder = await order.save();
        mailgun.messages().send(
          {
            from: 'Tuginternet <me@mg.tuginternet.co>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order [${order._id}] is now complete.`,
            html: emailTemplates.payOrder(order),
          },
          (error, body) => {
            console.log(error);
          }
        );
        await db.disconnect()
        res.send({ message: 'Order Sent', order: updatedOrder });
        res.send(order);
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Order Not Found' });
    }
})

export default handler;