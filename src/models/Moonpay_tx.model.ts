import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum TransactionStatus {
  PENDING = 'pending',
  WAITING_PAYMENT = 'waiting_payment',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface IMoonpayTransaction extends Document {
  user: mongoose.Types.ObjectId;
  areFeesIncluded: boolean;
  baseCurrency: string;
  baseCurrencyAmount: number;
  createdAt: Date;
  extraFeeAmount: number;
  feeAmount: number;
  networkFeeAmount: number;
  quoteCurrency: string;
  quoteCurrencyAmount: number;
  status: TransactionStatus;
  walletAddress: string;
  walletAddressTag?: string | null;
}

const MoonpayTransactionSchema = new Schema<IMoonpayTransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  areFeesIncluded: { type: Boolean, required: true },
  baseCurrency: { type: String, required: true },
  baseCurrencyAmount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  extraFeeAmount: { type: Number, required: true },
  feeAmount: { type: Number, required: true },
  networkFeeAmount: { type: Number, required: true },
  quoteCurrency: { type: String, required: true },
  quoteCurrencyAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: true
  },
  walletAddress: { type: String, required: true },
  walletAddressTag: { type: String, default: null },
});

MoonpayTransactionSchema.plugin(mongoosePaginate);

const Moonpay_Tx = mongoose.model<IMoonpayTransaction, mongoose.PaginateModel<IMoonpayTransaction>>(
  'MoonpayTransaction',
  MoonpayTransactionSchema
);

export default Moonpay_Tx;