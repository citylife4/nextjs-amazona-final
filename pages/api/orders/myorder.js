import nextConnect from "next-connect";
import { onError } from "../../../utils/error";
import db from "../../../utils/db";
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler.use(isAuth).get(async (req, res) => {
    await db.connect();
    const orders = await Order.find({ user: req.user._id });
    await db.disconnect();
    res.send(orders);


})

export default handler;