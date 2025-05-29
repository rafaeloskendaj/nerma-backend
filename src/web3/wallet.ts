import { ethers } from 'ethers';
import provider from './provider';

const { ADMIN_WALLET_PVKEY } = process.env;

if (!ADMIN_WALLET_PVKEY) {
  throw new Error('ADMIN_WALLET_PVKEY is not set in environment variables.');
}

const createSigner = (): ethers.Wallet => {
  return new ethers.Wallet(ADMIN_WALLET_PVKEY, provider);
};

export default createSigner;
