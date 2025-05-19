import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

export interface IUserAggregator extends Document {
  user: IUser['_id'];
  accessToken: string;
  itemId: string;
  publicToken: string;
  aggregator: string;
}

const UserAggregatorSchema = new Schema<IUserAggregator>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  itemId: { type: String },
  publicToken: { type: String },
  aggregator:  { type: String, required: true }
}, {
  timestamps: true,
});

const UserAggregator = mongoose.model<IUserAggregator>('UserAggregator', UserAggregatorSchema);

export default UserAggregator;