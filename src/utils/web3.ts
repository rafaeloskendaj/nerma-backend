import { Wallet } from 'ethers';

export function createWeb3Wallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}

