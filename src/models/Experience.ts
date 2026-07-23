import mongoose, { Schema, Document } from "mongoose";
import type { ExperienceItem } from "@/types";

export interface IExperienceDocument extends ExperienceItem, Document {}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    responsibilities: [{ type: String }],
  },
  { timestamps: true }
);

export const ExperienceModel =
  mongoose.models.Experience ||
  mongoose.model<IExperienceDocument>("Experience", ExperienceSchema);
