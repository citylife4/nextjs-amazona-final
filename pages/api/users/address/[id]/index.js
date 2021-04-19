import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import User from '../../../../../models/User';
import { isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';


const handler = nextConnect();

handler
    .use(isAuth)
    .get(async (req, res) => {
        await db.connect();
        const user = await User.findById(req.user._id);
        const address = user.addresses.find((x) => x._id == req.query.id);
        if (address) {
            await db.disconnect();
            res.send(address);
        } else {
            await db.disconnect();
            res.status(404).send({ message: 'Address Not Found.' });
        }
    })
    .use(isAuth).put(async (req, res) => {
        await db.connect();
        const user = await User.findById(req.user._id);
        if (user) {
            const address = {
                _id: mongoose.Types.ObjectId(req.query.id),
                country: req.body.country,
                fullName: req.body.fullName,
                addressType: req.body.addressType,
                streetAddress: req.body.streetAddress,
                city: req.body.city,
                isDefault: req.body.isDefault,
                states: req.body.states,
                postalCode: req.body.postalCode,
                phoneNumber: req.body.phoneNumber,
                deliverInstructions: req.body.deliverInstructions,
                securityCode: req.body.securityCode,
            };
            user.addresses = user.addresses.map((x) =>
                x._id == req.query.id ? address : x
            );
            await user.save();
            await db.disconnect();
            res.status(200).send({
                message: 'Address Updated.',
                address,
            });
        } else {
            await db.disconnect();
            res.status(401).send({ message: 'User does not exist.' });
        }

    })
    .use(isAuth).delete(async (req, res) => {
        try {
            await db.connect();
            const user = await User.findById(req.user._id);
            user.addresses = user.addresses.filter((x) => x._id != req.query.id);
            await user.save();
            await db.disconnect();
            res.send({
                success: true,
                message: 'Successfully deleted the address',
            });
        } catch (err) {
            await db.disconnect();
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    })

export default handler;