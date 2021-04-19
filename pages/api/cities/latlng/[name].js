import nextConnect from 'next-connect';
import { availableCities } from '../../../../utils/config';

const handler = nextConnect({});

handler.get(async (req, res) => {
  const city = availableCities.find((x) => x.name === req.query.name);
  if (city) {
    res.send(city);
  } else {
    res.status(404).send({ message: 'No city found' });
  }
});

export default handler;
