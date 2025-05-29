import Otp from '../models/otp.model';

export async function createOtp(data) {
  return await Otp.create(data);
}

export async function getLatestOtp(userId: unknown, type) {
  return await Otp.findOne({
    user: userId,
    type,
    verified: false,
  });
}

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
