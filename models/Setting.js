import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      requred: true,
    },
    pageSize: {
      type: Number,
      requred: true,
    },
    siteLogo: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);