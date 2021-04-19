import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionType: {
      type: String,
      enum: ['BUYED', 'SOLD', 'REFUND', 'CANCELED'],
      required: true,
    },
    qty: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [String],
    cities: [String],
    transactions: [transactionSchema],
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    department: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    countInStock: { type: Number, default: 0, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    buyPrice: { type: Number, default: 0, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, required: false, min: 0 },
    numReviews: { type: Number, default: 0 },
    discount: { type: Number, required: false },
    reviews: [reviewSchema],
    sold: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    featured: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isDiscounted: { type: Boolean, default: false },
    isToprated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.virtual('isRecommended').get(function getVirtual() {
  return this.featured === 2;
});

productSchema.virtual('isFeatured').get(function getVirtual() {
  return this.featured === 1;
});

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
