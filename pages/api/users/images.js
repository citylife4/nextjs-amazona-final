import nextConnect from 'next-connect';
import User from '../../../models/User';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nextConnect();

handler.use(isAuth).get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id, 'images');
  await db.disconnect();
  res.send(user.images);
});

export default handler;
