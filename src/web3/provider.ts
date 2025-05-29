import { ethers } from 'ethers';

const { RPC_URL } = process.env;

if (!RPC_URL) {
  throw new Error('RPC_URL is not set in environment variables.');
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// provider.getIncreasedGasPrice = async (): Promise<ethers.BigNumberish> => {
//   const multiplier = parseFloat(GAS_PRICE_MULTIPLIER || '1') * 1000;

//   const feeData = await provider.getFeeData();
//   const baseGasPrice = feeData.gasPrice ?? ethers.parseUnits('1', 'gwei');
//   const maxFeePerGas = feeData.maxFeePerGas ?? baseGasPrice;

//   const increasedGasPrice = (baseGasPrice * BigInt(Math.floor(multiplier))) / BigInt(1000);

//   return increasedGasPrice > maxFeePerGas ? maxFeePerGas : increasedGasPrice;
// };

export default provider;
