import nextConnect from 'next-connect';
import User from '../../../../models/User';
import { isAuth } from '../../../../utils/auth';
import data from '../../../../utils/data';
import db from '../../../../utils/db';

const handler = nextConnect();

handler.use(isAuth).get(async (req, res) => {
  await db.connect();

  const user = await User.findById(req.user._id);
  if (user) {
    const addresses = user.addresses.filter((x) => x.isValid);
    addresses.unshift({ streetAddress: 'New Address' });
    await db.disconnect();
    res.status(201).send({
      message: 'Valid Addresses',
      addresses: addresses,
      countries: [{ name: '' }, ...data.countries],
    });
  } else {
    await db.disconnect();
    res.status(401).send({ message: 'User does not exist.' });
  }
});

export default handler;
