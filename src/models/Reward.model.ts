import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IRewardAggregator extends Document {
  userId: Types.ObjectId;
  aggregator: string;
  currentSyncDate: Date;
  nextSyncDate: Date;
  syncDurationMs: number;
  totalSpend: number;
  reward: number;
  createdAt?: Date;
}

const RewardAggregatorSchema = new Schema<IRewardAggregator>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aggregator: {
    type: String,
    required: true,
  },
  syncDurationMs: {
    type: Number,
    required: true,
  },
  totalSpend: {
    type: Number,
    required: true,
    default: 0,
  },
  reward: {
    type: Number,
    required: true,
    default: 0,
  }
},

  { timestamps: true }
);

RewardAggregatorSchema.plugin(mongoosePaginate);

const RewardAggregator = mongoose.model<IRewardAggregator, PaginateModel<IRewardAggregator>>('Reward_Aggregator', RewardAggregatorSchema);

export default RewardAggregator;