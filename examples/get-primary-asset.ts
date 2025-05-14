import { config } from "dotenv";
import { CHAIN_ID, UniversalAccount } from "@particle-network/universal-account-sdk";
import { getBytes, Wallet } from "ethers";

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || "");
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        ownerAddress: wallet.address,
        tradeConfig: {
            // if this is not set, will use auto slippage
            slippageBps: 100, // 100 means 1%, max is 10000
            // use parti to pay fee
            universalGas: true,
        }
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    // here is example to get primary asset
    const primaryAssets = await universalAccount.getPrimaryAssets();
    for (const asset of primaryAssets.assets) {
        console.log(`${asset.tokenType}: amount is ${asset.amount}, amountInUSD is ${asset.amountInUSD}`);
    }
    console.log(`total amountInUSD is ${primaryAssets.totalAmountInUSD}`);

})();
