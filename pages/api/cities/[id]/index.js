import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import City from '../../../../models/City';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const city = await City.findById(req.query.id);
    await db.disconnect();
    res.send(city);
  })
  .use(isAuth, isAdmin)
  .put(async (req, res) => {
    await db.connect();
    const city = await City.findById(req.query.id);
    if (city) {
      city.name = req.body.name;
      const updatedCity = await city.save();
      await db.disconnect();
      res.send({
        message: 'City Updated By Admin',
        city: updatedCity,
      });
    } else {
      await db.disconnect();
      res.status(500).send('City does not exist.');
    }
  })
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const city = await City.findById(req.query.id);
    if (city) {
      const deletedCity = await city.remove();
      await db.disconnect();
      res.send(deletedCity);
    } else {
      await db.disconnect();
      res.status(404).send('City Not Found.');
    }
  });

export default handler;
