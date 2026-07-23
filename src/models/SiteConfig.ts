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
  };
}

const SiteConfigSchema = new Schema<ISiteConfigDocument>(
  {
    name: { type: String, required: true },
    designationLoop: [{ type: String, required: true }],
    intro: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    profileImage: { type: String, default: "/profile.jpg" },
    bannerImage: { type: String, default: "" },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const SiteConfigModel =
  mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfigDocument>("SiteConfig", SiteConfigSchema);
