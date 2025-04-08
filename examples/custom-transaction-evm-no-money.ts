import { config } from "dotenv";
import { CHAIN_ID, UniversalAccount } from "@GDdark/universal-account";
import { Interface, getBytes, Wallet } from "ethers";

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
     * Contract Code On Base Mainnet:
     *
     * function checkIn() public {
     *     emit Checked(msg.sender);
     * }
     */

    const contractAddress = "0x2361a02e6727Ff1798920186b8ACf0f100f621C0";
    const interf = new Interface(["function checkIn() public"]);
    const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.BASE_MAINNET,
        expectTokens: [],
        transactions: [
            {
                to: contractAddress,
                data: interf.encodeFunctionData("checkIn"),
                value: "0x0",
            },
        ],
    });

    console.log("transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
