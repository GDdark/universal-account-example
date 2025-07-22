import { config } from "dotenv";
import { CHAIN_ID, serializeInstruction, SUPPORTED_TOKEN_TYPE, UniversalAccount } from "@particle-network/universal-account-sdk";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
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
    console.log("Your UA EVM Address:", smartAccountOptions.smartAccountAddress);
    console.log("Your UA Solana Address:", smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.SOLANA_MAINNET,
        // expect you need 0.000001 SOL on solana mainnet
        // if your money(USDC, USDT, ETH, etc.) is on other chain, will convert to SOL on solana mainnet
        expectTokens: [
            {
                type: SUPPORTED_TOKEN_TYPE.SOL,
                amount: "0.000001",
            }
        ],
        transactions: [serializeInstruction(SystemProgram.transfer({
            fromPubkey: new PublicKey(smartAccountOptions.solanaSmartAccountAddress as string),
            toPubkey: new PublicKey('7uY2Mh8fLasPfQ4CFKLMP7X26e51B67cKjjyq7wod8Hm'),
            lamports: 0.000001 * LAMPORTS_PER_SOL,
        }))],
    });

    console.log("transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
