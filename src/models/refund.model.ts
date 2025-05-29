import mongoose, { Document, Schema, Types } from "mongoose";
const { REFUND_PERCENTAGE } = process.env;

export interface IRefund extends Document {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  reason: string;
  refundStatus: string;
  isApprovedByAdmin: boolean;
  amount: number;
  adminNote: string;
}

const refundSchema: Schema<IRefund> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  reason: {
    type: String,
    required: true,
  },
  refundStatus: {
    type: String,
    default: "PENDING",
    enum: ["PENDING", "COMPLETE", "REJECTED"],
  },
  isApprovedByAdmin: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    default: parseInt(REFUND_PERCENTAGE || "0"),
  },
  adminNote: {
    type: String,
  },
});

const Refund = mongoose.model<IRefund>("Refund", refundSchema);

export default Refund;
