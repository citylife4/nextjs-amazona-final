import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Coupon from '../../../../models/Coupon';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler
    .use(isAuth, isAdmin)
    .get(async (req, res) => {
        await db.connect();
        const coupon = await Coupon.findById(req.query.id);
        await db.disconnect();
        res.send(coupon);
    })
handler
    .use(isAuth, isAdmin)
    .put(async (req, res) => {
        await db.connect();
        const coupon = await Coupon.findById(req.query.id);
        if (coupon) {
            coupon.name = req.body.name;
            coupon.expiry = req.body.expiry;
            coupon.discount = req.body.discount;
            const updatedCoupon = await coupon.save();
            await db.disconnect();
            res.send({
                message: 'Coupon Updated By Admin',
                coupon: updatedCoupon,
            });
        } else {
            await db.disconnect();
            res.status(404).send({ message: 'Coupon Not Found' });
        }
    })
    .use(isAuth, isAdmin)
    .delete(async (req, res) => {
        await db.connect();
        const coupon = await Coupon.findById(req.query.id);
        if (coupon) {
            const deletedCoupon = await coupon.remove();
            await db.disconnect();
            res.send({ message: 'Coupon Deleted', coupon: deletedCoupon });
        } else {
            await db.disconnect();
            res.status(404).send({ message: 'Coupon Not Found' });
        }
    })

export default handler;
