import nextConnect from 'next-connect';
import User from '../../../../models/User';
import db from '../../../../utils/db';

const handler = nextConnect();

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  if (!user) {
    res.status(404).send({ message: 'User not found' });
  } else {
    res.send({ message: 'User found' });
  }
});
export default handler;
