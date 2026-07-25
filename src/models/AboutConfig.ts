import mongoose, { Schema, Document } from "mongoose";
import type { AboutConfig } from "@/types";

export interface IAboutConfigDocument extends AboutConfig, Document {}

const AboutCardSchema = new Schema(
  {
    heading: { type: String, default: "" },
    paragraphs: [{ type: String }],
  },
  { _id: false }
);

const AboutConfigSchema = new Schema<IAboutConfigDocument>(
  {
    title: { type: String, default: "A little about me" },
    subtitle: {
      type: String,
      default:
        "I like building interfaces that feel effortless—clean visuals, solid structure, and small details that make people smile.",
    },
    cards: { type: [AboutCardSchema], default: [] },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.AboutConfig) {
  delete mongoose.models.AboutConfig;
}

export const AboutConfigModel =
  (mongoose.models.AboutConfig as mongoose.Model<IAboutConfigDocument>) ||
  mongoose.model<IAboutConfigDocument>("AboutConfig", AboutConfigSchema);
