import { config } from "dotenv";
import { CHAIN_ID, serializeInstruction, UniversalAccount } from "@particle-network/universal-account-sdk";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { getBytes, Wallet } from "ethers";
config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || "");
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        ownerAddress: wallet.address,
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log("Your UA EVM Address:", smartAccountOptions.smartAccountAddress);
    console.log("Your UA Solana Address:", smartAccountOptions.solanaSmartAccountAddress);

    /**
     * Contract Code On Solana:
     *
     * #[derive(Accounts)]
     * pub struct PrintPayerBalance<'info> {
     *     pub payer: SystemAccount<'info>, // No signer constraint
     * }
     *
     * impl<'info> PrintPayerBalance<'info> {
     *     pub fn execute(ctx: Context<Self>) -> Result<()> {
     *         msg!("payer balance: {}", ctx.accounts.payer.lamports());
     *         Ok(())
     *     }
     * }
     */

    const printPayerBalanceInstruction = new TransactionInstruction({
        data: Buffer.from("e71381f4c8c50db5", "hex"),
        keys: [
            {
                pubkey: new PublicKey(smartAccountOptions.solanaSmartAccountAddress as string),
                isWritable: false,
                isSigner: false,
            },
        ],
        programId: new PublicKey("BuuP1rJXnVs5GHSPoUxLqeQzV4nBXQ7RFAJ7j4rt6jEk"),
    });

    const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.SOLANA_MAINNET,
        expectTokens: [],
        transactions: [serializeInstruction(printPayerBalanceInstruction)],
    });

    console.log("transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
