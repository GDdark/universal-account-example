import { config } from "dotenv";
import { CHAIN_ID, UniversalAccount } from "@particle-network/universal-account-sdk";
import { getBytes, Wallet } from "ethers";
config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || "");
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        projectClientKey: process.env.PROJECT_CLIENT_KEY || "",
        projectAppUuid: process.env.PROJECT_APP_UUID || "",
        ownerAddress: wallet.address,
        tradeConfig: {
            // if this is not set, will use auto slippage
            slippageBps: 100, // 100 means 1%, max is 10000
            // use parti to pay fee
            universalGas: true,

            // if you want to use anti-MEV, you can set the tip amount to pay for the jito
            // recommended is 0.01, it means 0.01 SOL
            // 0 means not use anti-MEV
            solanaMEVTipAmount: 0,
        }
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createBuyTransaction({
        // buy sol
        // token: { chainId: CHAIN_ID.SOLANA_MAINNET, address: "0x0000000000000000000000000000000000000000" },
        
        // buy trump
        token: { chainId: CHAIN_ID.SOLANA_MAINNET, address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" },
        // buy $0.001 of trump
        amountInUSD: "0.001",
    });

    console.log("buy transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
