import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Coupon from '../../../models/Coupon';
import { isAuth, isAdmin } from '../../../utils/auth';
import { PAGE_SIZE } from '../../../utils/config';


const handler = nextConnect({
    onError,
});

handler.use(isAuth, isAdmin)
    .get(async (req, res) => {
        await db.connect();
        const page = Number(req.query.page) || 1;
        const searchQuery = req.query.query || 'all';
        const searchFilter =
            searchQuery !== 'all'
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: 'i',
                    },
                }
                : {};
        const coupons = await Coupon.find({ ...searchFilter })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .sort({ createdAt: -1 });
        const records = await Coupon.count({ ...searchFilter });
        await db.disconnect();
        res.send({ coupons, pages: Math.ceil(records / PAGE_SIZE) })
    })
    .use(isAuth, isAdmin)
    .post(async (req, res) => {
        await db.connect();
        const coupon = new Coupon({
            name: Math.random().toString(36).replace('0.', ''),
            expiry: Date.now(),
            discount: 10,
        });
        const createdCoupon = await coupon.save();
        await db.disconnect();
        res.send({ message: 'Coupon created successfully', coupon: createdCoupon });
    })

export default handler;
