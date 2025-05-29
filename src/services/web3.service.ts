import { ethers } from "ethers";
import { ERC20 } from "../web3/contracts/erc20";
import provider from "../web3/provider";
import UNISWAP_ROUTER_ABI from '../web3/abis/UniswapRouter.json';
import { TradeType } from "../models/Web3Transaction.model";

const erc20 = new ERC20();

export async function transferToken(address: string, amount) {
    const result = await erc20.transfer(address, amount);
    console.log(result)
    return result;
};

export async function getDecimals() {
    const result = await erc20.decimals();
    return result;
};


export async function getTransactionDetails(hash: string, user) {
    const routerInterface = new ethers.Interface(UNISWAP_ROUTER_ABI);

    const tx = await provider.getTransaction(hash);
    const decoded = routerInterface.parseTransaction({ data: tx.data, value: tx.value });

    const block = await provider.getBlock(tx.blockNumber!);
    const timestamp = new Date(block.timestamp * 1000);

    // Example: assuming it's a swapExactTokensForTokens
    const {
        args: [amountIn, amountOutMin, path, , to], // [amountIn, amountOutMin, path, deadline, to]
    } = decoded;

    console.log(amountIn, amountOutMin)
    const baseCurrency = path[0];
    const quoteCurrency = path[path.length - 1];

    const transactionType = baseCurrency.toLowerCase() === process.env.WETH_TOKEN_ADDRESS.toLowerCase()
        ? TradeType.BUY
        : TradeType.SELL;

    const data = {
        user,
        baseCurrency,
        baseAmount: Number(amountIn), // Assumes 18 decimals, customize per token
        quoteCurrency,
        quoteAmount: Number(amountOutMin),
        walletAddress: to,
        timestamp,
        type: transactionType,
        txHash: hash
    };

    return data;
}
