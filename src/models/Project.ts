import mongoose, { Schema, Document } from "mongoose";
import type { Project as IProject } from "@/types";

export interface IProjectDocument extends IProject, Document {
  order?: number;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    summary: { type: String, required: true },
    tags: [{ type: String }],
    description: { type: String, required: true },
    liveUrl: { type: String, default: "" },
    githubClientUrl: { type: String, default: "" },
    githubServerUrl: { type: String, default: "" },
    challenges: [{ type: String }],
    improvements: [{ type: String }],
    order: { type: Number, default: 0 },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Clear model cache in dev mode so schema updates apply immediately
if (process.env.NODE_ENV !== "production" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export const ProjectModel =
  (mongoose.models.Project as mongoose.Model<IProjectDocument>) ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);
