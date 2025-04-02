import { config } from "dotenv";
import { CHAIN_ID, UniversalAccount } from "@GDdark/universal-account";

config();

(async () => {
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        privateKey: process.env.PRIVATE_KEY || "",
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createSellTransaction({
        token: { chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
        // sell 0.0001 ARB Token (here ignore the decimals)
        // please make sure your UA Address has enough balance of this token
        amount: "0.0001",
    });

    console.log("sell transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction);

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
