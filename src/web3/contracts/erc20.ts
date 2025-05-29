import ERC20_ABI from "../abis/ERC20.json";
import Contract from "../contract";

const { NERMA_TOKEN_ADDRESS } = process.env;
export class ERC20 extends Contract {
  constructor() {
    super(NERMA_TOKEN_ADDRESS, ERC20_ABI);
  }

  async name() {
    return await this.contract.name();
  }

  async symbol() {
    return await this.contract.symbol();
  }

  async decimals() {
    return await this.contract.decimals();
  }

  async balanceOf(address: string) {
    return await this.contract.balanceOf(address);
  }

  async approve(spender: string, amount: bigint) {
    const tx = await this.contract.approve(spender, amount);
    return await tx.wait();
  }

  async transfer(walletAddress: string, amount: bigint) {
    const tx = await this.contract.transfer(walletAddress, amount);
    return await tx.wait();
  }

  async allowance(owner: string, spender: string) {
    return await this.contract.allowance(owner, spender);
  }

  async mint(address: string, amount: bigint) {
    return await this.contract.mint(address, amount);
  }

  async burn(amount: bigint) {
    return await this.contract.burn(amount);
  }

}
