import mongoose from 'mongoose';

const shippingDistanceSchema = new mongoose.Schema(
  {
    city: String,
    distance: Number,
    pirce: Number,
  },
  {
    timestamps: true,
  }
);

// Post /api/distance
// body: {name:'less than 20km', distance: 20, price: 100}
// Put /api/distance/2e22e2e2e2e2e2e2e2
// body: {name:'less than 20 km', distance: 20, price: 110}

export default mongoose.models.ShippingDistance ||
  mongoose.model('ShippingDistance', shippingDistanceSchema);
