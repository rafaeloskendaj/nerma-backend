import mongoose, { Document, Schema } from 'mongoose';

export interface IUserConfig extends Document {
  user: mongoose.Types.ObjectId;
  aggregator: string
  totalSpent: number;
  totalReward: number;
  currentSyncDate: Date;
  nextSyncDate: Date;
  syncDurationMs: number;
  totalReferralReward: number;
  refereeReward: number;
}

const UserConfigSchema: Schema<IUserConfig> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  aggregator : {
    type: String,
    required: true
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  totalReward: {
    type: Number,
    default: 0,
  },
  totalReferralReward: {
    type: Number,
    default: 0,
  },
  refereeReward: {
    type: Number,
    default: 0,
  },
  currentSyncDate: {
    type: Date,
  },
  nextSyncDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export const UserConfig = mongoose.model<IUserConfig>('UserConfig', UserConfigSchema);
