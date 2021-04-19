import nextConnect from 'next-connect';

import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler.post(async (req, res) => {
  await db.connect();
  const signedinUser = await User.findOne({
    email: req.body.email,
  });
  await db.disconnect();

  if (
    signedinUser &&
    bcrypt.compareSync(req.body.password, signedinUser.password)
  ) {
    const token = signToken(signedinUser);
    res.status(200).send({
      success: true,
      _id: signedinUser._id,
      name: signedinUser.name,
      email: signedinUser.email,
      isAdmin: signedinUser.isAdmin,
      avatar: signedinUser.avatar,
      token: token,
    });
  } else {
    res.status(401).send({ message: 'Invalid User or Password' });
  }
});

export default handler;
