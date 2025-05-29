import mongoose, { Schema, Document } from 'mongoose';
import { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referee: mongoose.Types.ObjectId;
  isAggregatorConnected: boolean;
  rewardAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema: Schema = new Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAggregatorConnected: {
      type: Boolean,
      required: true,
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

referralSchema.plugin(mongoosePaginate);

const Referral = mongoose.model<IReferral, PaginateModel<IReferral>>('Referral', referralSchema);

export default Referral;