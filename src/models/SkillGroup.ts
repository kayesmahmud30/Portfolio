import mongoose, { Schema, Document } from "mongoose";

export interface ISkill {
  name: string;
  iconName?: string;
  level: number;
}

export interface ISkillGroupDocument extends Document {
  title: string;
  skills: ISkill[];
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  iconName: { type: String, default: "" },
  level: { type: Number, required: true, min: 0, max: 100 },
});

const SkillGroupSchema = new Schema<ISkillGroupDocument>(
  {
    title: { type: String, required: true },
    skills: [SkillSchema],
  },
  { timestamps: true }
);

export const SkillGroupModel =
  mongoose.models.SkillGroup ||
  mongoose.model<ISkillGroupDocument>("SkillGroup", SkillGroupSchema);
