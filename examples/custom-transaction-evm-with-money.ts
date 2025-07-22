import { config } from "dotenv";
import { CHAIN_ID, SUPPORTED_TOKEN_TYPE, UniversalAccount } from "@particle-network/universal-account-sdk";
import { getBytes, Interface, parseEther, toBeHex } from "ethers";
import { Wallet } from "ethers";

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

    /**
     * Contract Code On Base Mainnet:
     * This function is payable, so it needs to pay money.
     *
     * function checkIn() public payable {
     *     require(msg.value == 0.0000001 ether, 'CheckIn: Insufficient ETH');
     *     emit Checked(msg.sender);
     * }
     */

    const contractAddress = "0x14dcD77D7C9DA51b83c9F0383a995c40432a4578";
    const interf = new Interface(["function checkIn() public payable"]);
    const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.BASE_MAINNET,
        // expect you need 0.0000001 ETH on base mainnet
        // if your money(USDC, USDT, SOL, etc.) is on other chain, will convert to ETH on base mainnet
        expectTokens: [
            {
                type: SUPPORTED_TOKEN_TYPE.ETH,
                amount: "0.0000001",
            },
        ],
        transactions: [
            {
                to: contractAddress,
                data: interf.encodeFunctionData("checkIn"),
                value: toBeHex(parseEther("0.0000001")),
            },
        ],
    });

    console.log("transaction", transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
