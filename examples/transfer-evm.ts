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

    const transaction = await universalAccount.createTransferTransaction({
        token: { chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
        amount: "0.0001",
        // the rpc url of the chain you want to transfer to, here is arbitrum mainnet
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        // the receiver address
        receiver: "0x98F4c42009dc2CC8797b3f4bE2C59d98278D675A",
    });

    console.log("transfer transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction);

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
