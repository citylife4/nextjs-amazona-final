import nextConnect from 'next-connect';
import { onError } from '../../utils/error';
import haversine from 'haversine';
import { availableCities } from '../../utils/config';
import ShippingDistance from '../../models/ShippingDistance';

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  console.log(req.query);
  if (!req.query.lat || !req.query.lng) {
    res.status(400).send({
      message: 'This city does not have lat and lng',
    });
  } else if (availableCities.find((x) => x.name === req.query.city)) {
    const address = {
      lat: req.query.lat,
      lng: req.query.lng,
      city: req.query.city,
    };

    const storeloc = {
      latitude: 28.56112,
      longitude: 77.12165,
    };

    const deliveryloc = {
      latitude: address.lat,
      longitude: address.lng,
    };

    const haversineDistance = haversine(storeloc, deliveryloc, {
      unit: 'km',
    });

    const shippingDistance = ShippingDistance.findOne({
      distance: { $lte: haversineDistance },
    });
    if (shippingDistance) {
      res.send({ price: shippingDistance.price });
    } else {
      res.status(400).send({
        message: 'This distance does not supported',
      });
    }
  } else {
    res.status(400).send({
      message: 'This city does not supported',
    });
  }
});

export default handler;
