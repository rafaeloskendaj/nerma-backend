import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum TradeType {
  BUY = 'buy',
  SELL = 'sell'
}

export interface IWeb3Transaction extends Document {
  user: mongoose.Types.ObjectId;
  baseCurrency: string;
  baseAmount: string;
  quoteCurrency: string;
  quoteAmount: string;
  walletAddress: string;
  timestamp: Date;
  type: TradeType;
  txHash: string;
}

const Web3TransactionSchema = new Schema<IWeb3Transaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  baseCurrency: { type: String, required: true },
  baseAmount: { type: String, required: true },
  quoteCurrency: { type: String, required: true },
  quoteAmount: { type: String, required: true },
  walletAddress: { type: String, required: true },
  timestamp: { type: Date, required: true },
  type: {
    type: String,
    enum: Object.values(TradeType),
    required: true,
  },
  txHash: {type: String, required: true}
});

Web3TransactionSchema.plugin(mongoosePaginate);

export default mongoose.model<IWeb3Transaction, mongoose.PaginateModel<IWeb3Transaction>>(
  'Web3Transaction',
  Web3TransactionSchema
);
