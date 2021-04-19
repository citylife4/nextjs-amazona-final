import nextConnect from 'next-connect';
import User from '../../../models/User';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nextConnect();

handler.use(isAuth, isAdmin).get(async (req, res) => {
    await db.connect();
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
    const userDocs = await User.find({ ...searchFilter });
    await db.disconnect();
    const users = userDocs.map(db.convertDocToObj);
    res.send(users);
});

export default handler;