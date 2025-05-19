import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  price_id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  metadata: { [key: string]: string };
}

const PlanSchema = new Schema<IPlan>({
  price_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  interval: { type: String, enum: ['day', 'week', 'month', 'year'], required: true },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

const SubscriptionPlan = mongoose.model<IPlan>(
  "SubscriptionPlan",
  PlanSchema
);

export default SubscriptionPlan;