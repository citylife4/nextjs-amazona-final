import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { isAuth } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    totalBuyPrice: req.body.totalBuyPrice,
    deliverScheduledAt: req.body.deliverScheduledAt,
    deliverScheduledTo: req.body.deliverScheduledTo,
    deliverScheduledTime: req.body.deliverScheduledTime,
    user: req.user._id,
  });

  // Check count in stock
  for (const index in newOrder.orderItems) {
    const item = newOrder.orderItems[index];
    const productP = await Product.findOne(item.product);
    const product = await Product.findById(productP);
    if (product.countInStock < item.quantity) {
      res.status(400).send({
        message: `Error: There are only ${product.countInStock} instance of ${product.name}`,
      });
      return;
    }
  }

  newOrder.transactions.push({
    user: req.user._id,
    userName: req.user.name,
    transactionType: 'CREATED',
  });

  const newOrderCreated = await newOrder.save();
  await db.disconnect();

  res
    .status(201)
    .send({ message: 'New Order Created', order: newOrderCreated });
});

export default handler;
