import mongoose, { Document, Schema } from "mongoose";


interface ITransaction extends Document {
  hash: string;
  walletAddress: string;
  transactionType: string;
  amount: mongoose.Schema.Types.Decimal128;
  timestamp: Date;
  adminWalletAddress: string;
}


const transactionSchema = new Schema<ITransaction>({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
    required: true, 
  },
  transactionType: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true, 
  },
  timestamp: {
    type: Date,
    default: Date.now, 
  },
  adminWalletAddress: {
    type: String,
    required: true,
  },
});

const AdminTransaction = mongoose.model<ITransaction>("Admin-Transaction", transactionSchema);

export default AdminTransaction;
