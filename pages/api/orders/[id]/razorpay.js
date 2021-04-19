import nextConnect from "next-connect";
import { onError } from "../../../../utils/error";
import db from "../../../../utils/db";
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import Razorpay from 'razorpay';
import shortid from 'shortid';

const handler = nextConnect({
    onError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = 'razorpay';
        order.paymentResult = {
            id: req.body.id,
            paymentStatus: req.body.paymentStatus,
        }
        const updatedOrder = await order.save();
        await db.disconnect()
        res.send({ message: 'Order Paid', order: updatedOrder });

    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Order Not Found' });
    }
})

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    callback_url: `${process.env.BASE_URL}/profile`,
    redirect: true,
});

razorpay = nextConnect({
    onError,
});

razorpay.post(async (req, res) => {
    const order = await Order.findById(req.query.id);
    if (order) {
        const payment_capture = 1;
        const currency = 'INR';

        const options = {
            currency,
            receipt: shortid.generate(),
            payment_capture,
        };

        try {
            const response = razorpay.orders.create(options);
            res.json({
                id: response.id,
                currency: response.currency,
            });
        } catch (error) {
            console.log(error);
        }
    }
})

export default { handler, razorpay };