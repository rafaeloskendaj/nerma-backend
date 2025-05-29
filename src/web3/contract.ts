import { ethers } from 'ethers';
import provider from './provider';
import createSigner from './wallet';

class Contract {
  address;
  provider;
  signer;
  contract;

  constructor(address, abi) {
    this.address = address;
    this.provider = provider;
    this.signer = createSigner();
    const providerOrSigner = this.signer || this.provider;
    this.contract = new ethers.Contract(address, abi, providerOrSigner);
  }
}

export default Contract;
