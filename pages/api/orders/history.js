import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Order from '../../../models/Order';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
    onError,
});
handler.use(isAuth, isAdmin).get(async (req, res) => {
    await db.connect();
    const searchQuery = req.query.query || 'all';
    const searchFilter =
        searchQuery !== 'all'
            ? {
                _id: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
            
    const orderDocs = await Order.find({ ...searchFilter }).populate('user','name');
    await db.disconnect();
    const orders = orderDocs.map(db.convertDocToObj);
    res.send(orders);
});
export default handler;