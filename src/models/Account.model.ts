import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAccount extends Document {
  user: Types.ObjectId;
  account_id: string; 
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
  aggregator: string;
  balances: {
    available: number;
    current: number;
    iso_currency_code: string;
    limit?: number | null;
    unofficial_currency_code?: string | null;
  };
}

const AccountSchema: Schema = new Schema<IAccount>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    account_id: { type: String, required: true, unique: true },
    aggregator: { type: String, required: true },
    mask: { type: String, required: true },
    name: { type: String, required: true },
    official_name: { type: String, required: true },
    subtype: { type: String, required: true },
    type: { type: String, required: true },
    balances: {
      available: { type: Number, required: true },
      current: { type: Number, required: true },
      iso_currency_code: { type: String, required: true },
      limit: { type: Number, default: null },
      unofficial_currency_code: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const Account = mongoose.model<IAccount>('Account', AccountSchema);
export default Account;
