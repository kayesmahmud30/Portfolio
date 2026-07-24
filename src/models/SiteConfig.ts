import mongoose, { Schema, Document } from "mongoose";
import type { SiteConfig as ISiteConfig } from "@/types";

export interface ISiteConfigDocument extends Omit<ISiteConfig, "socials">, Document {
  profileImage?: string;
  bannerImage?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    leetcode?: string;
  };
}

const SiteConfigSchema = new Schema<ISiteConfigDocument>(
  {
    name: { type: String, required: true },
    designationLoop: [{ type: String, required: true }],
    intro: { type: String, required: true },
    location: { type: String, required: true },
    profileImage: { type: String, default: "/profile.jpg" },
    bannerImage: { type: String, default: "" },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      leetcode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.SiteConfig;
}

export const SiteConfigModel =
  mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfigDocument>("SiteConfig", SiteConfigSchema);
