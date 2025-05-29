import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IClaimReward extends Document {
  userId: mongoose.Types.ObjectId;
  amount: string;
  claimedDate: Date;
  transactionHash: string;
  userWalletAddress: string;
}

const claimRewardSchema = new Schema<IClaimReward>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: String, required: true, min: 0 },
  claimedDate: { type: Date, default: Date.now },
  transactionHash: { type: String, required: true, unique: true },
  userWalletAddress: {type: String, required: true}
});

claimRewardSchema.plugin(mongoosePaginate);

const ClaimReward = mongoose.model<IClaimReward, mongoose.PaginateModel<IClaimReward>>(
  'ClaimReward',
  claimRewardSchema
);

export default ClaimReward;