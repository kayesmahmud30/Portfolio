import mongoose, { Schema, Document } from "mongoose";
import type { EducationItem } from "@/types";

export interface IEducationDocument extends EducationItem, Document {}

const EducationSchema = new Schema<IEducationDocument>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const EducationModel =
  mongoose.models.Education ||
  mongoose.model<IEducationDocument>("Education", EducationSchema);
