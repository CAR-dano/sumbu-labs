import mongoose, { Schema, Model } from "mongoose";

export interface IRole extends mongoose.Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Clear cached model if exists in development
if (process.env.NODE_ENV !== "production" && mongoose.models.Role) {
  delete mongoose.models.Role;
}

const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema);

export default Role;
