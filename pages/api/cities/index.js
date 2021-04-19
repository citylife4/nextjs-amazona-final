import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import City from '../../../models/City';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
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
    const cities = await City.find({ ...searchFilter });
    await db.disconnect();
    res.send(cities);
  })
  .use(isAuth, isAdmin)
  .post(async (req, res) => {
    await db.connect();
    const city = new City({
      name: 'Sample City',
    });
    const createdCity = await city.save();
    if (createdCity) {
      await db.disconnect();
      res.status(201).send({
        city: createdCity,
        message: 'City created successfuly',
      });
    } else {
      await db.disconnect();
      res.status(500).send({ message: 'Error in creating City' });
    }
  });

export default handler;
