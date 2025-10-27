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
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const transactions = await universalAccount.getTransactions(1, 20);
    console.log("transactions", transactions);

    const tokenTransactions = await universalAccount.getTokenTransactions({chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: "0x912CE59144191C1204E64559FE8253a0e49E6548"});
    console.log("tokenTransactions", tokenTransactions);

    const tokenTransactions2 = await universalAccount.getTokenTransactions({chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: "0x912CE59144191C1204E64559FE8253a0e49E6548"}, tokenTransactions.nextPageToken);
    console.log("tokenTransactions2", tokenTransactions2);
})();
