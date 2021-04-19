import nextConnect from 'next-connect';
import User from '../../../../models/User';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';


const handler = nextConnect();

handler.use(isAuth).get(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.user._id);
    await db.disconnect();
    res.send(user.addresses || []);
})
    .use(isAuth).post(async (req, res) => {
        await db.connect();
        const user = await User.findById(req.user._id);
        if (user) {
            const address = {
                country: req.body.country,
                fullName: req.body.fullName,
                addressType: req.body.addressType,
                streetAddress: req.body.streetAddress,
                isDefault: req.body.isDefault,
                city: req.body.city,
                states: req.body.states,
                postalCode: req.body.postalCode,
                phoneNumber: req.body.phoneNumber,
                deliverInstructions: req.body.deliverInstructions,
                securityCode: req.body.securityCode,
            };
            user.addresses.push(address);
            const updatedUser = await user.save();
            await db.disconnect();
            res.status(201).send({
                message: 'Address Created.',
                address: updatedUser.addresses[updatedUser.addresses.length - 1],
            });
        } else {
            await db.disconnect();
            res.status(401).send({ message: 'User does not exist.' });
        }

    })


export default handler;