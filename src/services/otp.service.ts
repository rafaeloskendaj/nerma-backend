import { Types } from 'mongoose';
import Otp from '../models/otp.model';

export async function createOtp(data) {
  return await Otp.create(data);
}

export async function getLatestOtp(userId: Types.ObjectId, type) {
  return await Otp.findOne({
    user: userId,
    type,
    verified: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
}
