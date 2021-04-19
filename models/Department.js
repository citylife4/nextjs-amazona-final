import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: String,
    order: Number,
    isAdded: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    categories: [
      {
        name: String,
        order: Number,
        isAdded: { type: Boolean, default: false },
        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        subcategories: [
          {
            name: String,
            order: Number,
            isAdded: { type: Boolean, default: false },
            isEdited: { type: Boolean, default: false },
            isDeleted: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Department || mongoose.model('Department', departmentSchema);