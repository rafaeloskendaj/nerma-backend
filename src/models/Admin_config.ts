import mongoose, { Document, Schema } from "mongoose";

export interface IAdminConfig extends Document {
  basicTierPercentage: number;
  premiumTierPercentage: number;
  premiumPlusTierPercentage: number;
  cashOutFees: number;
  APYFee: number;
  ContractPause: number;
  cashOutFee: number;
}

const AdminConfigSchema = new Schema<IAdminConfig>(
  {
    basicTierPercentage: { type: Number, required: true },
    premiumTierPercentage: { type: Number, required: true },
    premiumPlusTierPercentage: { type: Number, required: true },
    cashOutFees: { type: Number },
    APYFee: { type: Number },
    ContractPause: { type: Number },
    cashOutFee: { type: Number },
  },
  {
    timestamps: true,
  }
);

const AdminConfig = mongoose.model<IAdminConfig>(
  "AdminConfig",
  AdminConfigSchema
);

export default AdminConfig;
