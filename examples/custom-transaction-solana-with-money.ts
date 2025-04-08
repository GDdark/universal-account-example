import { config } from "dotenv";
import { CHAIN_ID, serializeInstruction, SUPPORTED_TOKEN_TYPE, UniversalAccount } from "@GDdark/universal-account";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";

config();

(async () => {
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        privateKey: process.env.PRIVATE_KEY || "",
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log("Your UA EVM Address:", smartAccountOptions.smartAccountAddress);
    console.log("Your UA Solana Address:", smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.SOLANA_MAINNET,
        // expect you need 0.000001 SOL on solana mainnet
        // if your money(USDC, USDT, SOL, etc.) is on other chain, will convert to SOL on solana mainnet
        expectTokens: [
            {
                type: SUPPORTED_TOKEN_TYPE.SOL,
                amount: "0.000001",
            }
        ],
        transactions: [serializeInstruction(SystemProgram.transfer({
            fromPubkey: new PublicKey(smartAccountOptions.solanaSmartAccountAddress as string),
            toPubkey: new PublicKey('KqdS34NGUHRigqWMMgvxajATqyidsoN6ZRsgVJCt1wG'),
            lamports: 0.000001 * LAMPORTS_PER_SOL,
        }))],
    });

    console.log("transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction);

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
