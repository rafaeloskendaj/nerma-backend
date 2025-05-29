import mongoose, { Document, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IToken extends Document {
  userId: Types.ObjectId;
  token_address: string;
  name: string;
  symbol: string;
  decimals: string;
  balance: string;
  type: 'crypto' | 'fiat';
  last24hChangePercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token_address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    decimals: {
      type: String,
    },
    balance: {
      type: String,
    },
    type: {
      type: String,
      enum: ['crypto', 'fiat'],
      default: 'crypto',
    },
    last24hChangePercent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

TokenSchema.plugin(mongoosePaginate);

const Token = mongoose.model<IToken, mongoose.PaginateModel<IToken>>('Token', TokenSchema);

export default Token;
