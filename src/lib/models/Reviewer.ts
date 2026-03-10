import mongoose, { Schema, Model, Document } from "mongoose";

export interface ReviewerDocument extends Document {
  username: string;
  password_hash: string;
  display_name?: string;
  created_at: Date;
}

const ReviewerSchema = new Schema<ReviewerDocument>({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  display_name: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const Reviewer: Model<ReviewerDocument> =
  (mongoose.models.Reviewer as Model<ReviewerDocument>) ||
  mongoose.model<ReviewerDocument>("Reviewer", ReviewerSchema);
