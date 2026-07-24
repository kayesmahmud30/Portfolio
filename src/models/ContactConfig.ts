import mongoose, { Schema, Document } from "mongoose";

export interface IContactConfigDocument extends Document {
  email: string;
  phone?: string;
  whatsapp?: string;
}

const ContactConfigSchema = new Schema<IContactConfigDocument>(
  {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.ContactConfig;
}

export const ContactConfigModel =
  mongoose.models.ContactConfig ||
  mongoose.model<IContactConfigDocument>("ContactConfig", ContactConfigSchema, "contactconfigs");
