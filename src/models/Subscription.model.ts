import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
  user: Types.ObjectId;
  tier: string;
  isActive: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  period: {
    start: Date;
    end: Date;
  };
  invoice_pdf?: string;
  hosted_invoice_url?: string;
  description?: string;
  invoiceNumber?: string;
  amountPaid: number;
  amountRemaining: number;
  status: "paid" | "unpaid" | "overpaid" | "refunded" | "rejected";
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  priceId: string;
  stripePaymentIntentId: string;
}

const SubscriptionSchema: Schema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tier: {
      type: String,
      default: "Basic",
    },
    isActive: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    period: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    invoice_pdf: { type: String },
    hosted_invoice_url: { type: String },
    description: { type: String },
    invoiceNumber: { type: String },
    amountPaid: { type: Number, default: 0 },
    amountRemaining: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overpaid", "refunded", "rejected"],
      default: "unpaid",
    },
    paymentDate: { type: Date },
    priceId: String,
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);

export default Subscription;
