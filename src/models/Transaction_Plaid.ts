import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ITransaction extends Document {
  user: Types.ObjectId;
  account: Types.ObjectId;
  aggregator: string;
  account_id: string;
  amount: number;
  category: string[];
  category_id: string;
  check_number?: string | null;
  date: string;
  datetime?: Date | null;
  iso_currency_code: string;
  logo_url?: string;
  merchant_entity_id?: string;
  merchant_name?: string;
  name: string;
  payment_channel: string;
  pending: boolean;
  pending_transaction_id?: string | null;
  personal_finance_category_icon_url?: string;
  transaction_code?: string | null;
  transaction_id: string;
  transaction_type: string;
  unofficial_currency_code?: string | null;
  website?: string;
  available_balance: number;
  current_balance: number;
  account_name: string;
  account_official_name: string;
  subtype: string;
  type: string;
}

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    aggregator: { type: String, required: true },
    account_id: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: [String] },
    category_id: { type: String },
    date: { type: String, required: true },
    datetime: { type: Date, default: null },
    iso_currency_code: { type: String, required: true },
    logo_url: { type: String },
    merchant_entity_id: { type: String },
    merchant_name: { type: String },
    name: { type: String, required: true },
    payment_channel: { type: String, required: true },
    pending: { type: Boolean, required: true },
    pending_transaction_id: { type: String, default: null },
    personal_finance_category_icon_url: { type: String },
    transaction_code: { type: String, default: null },
    transaction_id: { type: String, required: true, unique: true },
    transaction_type: { type: String, required: true },
    unofficial_currency_code: { type: String, default: null },
    website: { type: String },
    available_balance: { type: Number },
    current_balance: { type: Number },
    account_name: { type: String },
    account_official_name: { type: String },
    subtype: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

TransactionSchema.plugin(mongoosePaginate);

const Aggregator_Transaction = mongoose.model<ITransaction, PaginateModel<ITransaction>>(
  'Aggregator_Transaction',
  TransactionSchema
);

export default Aggregator_Transaction;
