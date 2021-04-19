import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  country: String,
  fullName: String,
  addressType: String,
  streetAddress: String,
  city: String,
  states: String,
  postalCode: String,
  phoneNumber: String,
  deliverInstructions: String,
  securityCode: String,
  lat: Number,
  lng: Number,
  isDefault: { type: Boolean, default: false },
});
AddressSchema.virtual('isValid').get(function () {
  return this.country && this.fullName && this.phoneNumber;
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    addresses: [AddressSchema],
    avatar: String,
    images: [{url:String, usages:[String]}], // url: cloudinary.com usages: ["product/1","user/2", /...]
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.User || mongoose.model('User', userSchema);
