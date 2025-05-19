import { Schema, model, Document, Types } from 'mongoose';

export type OtpType = 'email' | 'phone';

export interface IOtp extends Document {
  user: Types.ObjectId;
  otp: string;
  type: OtpType;
  verified: boolean;
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model<IOtp>('Otp', OtpSchema);

export default Otp;