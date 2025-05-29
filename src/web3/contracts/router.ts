import { Contract, TransactionResponse, TransactionReceipt } from "ethers";
import UNISWAP_ROUTER_ABI from "../abis/UniswapRouter.json";

export class UniswapRouter {
  private contract: Contract;

  constructor() {
    this.contract = new Contract(process.env.UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI);

  }

  // swapExactTokensForTokens
  async swapExactTokensForTokens(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: number
  ): Promise<TransactionReceipt> {
    const tx: TransactionResponse = await this.contract.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    );
    return await tx.wait();
  }

  // swapExactTokensForETH
  async swapExactTokensForETH(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: number
  ): Promise<TransactionReceipt> {
    const tx: TransactionResponse = await this.contract.swapExactTokensForETH(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    );
    return await tx.wait();
  }

  // Get expected output amounts
  async getAmountsOut(amountIn: string, path: string[]): Promise<string[]> {
    return await this.contract.getAmountsOut(amountIn, path);
  }

}
