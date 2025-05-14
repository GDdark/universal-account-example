import { config } from "dotenv";
import { CHAIN_ID, UniversalAccount } from "@particle-network/universal-account-sdk";
import { getBytes, Wallet } from "ethers";

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || "");       
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        ownerAddress: wallet.address,
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createSellTransaction({
        token: { chainId: CHAIN_ID.SOLANA_MAINNET, address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" },
        // sell 0.00001 Trump Token (here ignore the decimals)
        // please make sure your UA Solana Address has enough balance of this token
        amount: "0.00001",
    });

    console.log("sell transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
