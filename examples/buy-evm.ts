import { config } from "dotenv";
import { CHAIN_ID, UA_TRANSACTION_STATUS, UniversalAccount, SUPPORTED_TOKEN_TYPE } from "@particle-network/universal-account-sdk";
import { formatUnits, getBytes, Wallet } from "ethers";

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
            // can use specific token to pay
            usePrimaryTokens: [SUPPORTED_TOKEN_TYPE.USDC]
        },
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log("Your UA EVM Address:", smartAccountOptions.smartAccountAddress);
    console.log("Your UA Solana Address:", smartAccountOptions.solanaSmartAccountAddress);

    // here is example to buy arb, if you want to buy native token, the address is 0x0000000000000000000000000000000000000000
    const transaction = await universalAccount.createBuyTransaction({
        token: { chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
        // buy $0.001 of arb
        amountInUSD: "0.001",
    });

    console.log("buy transaction", transaction);

    const feeQuote = transaction.feeQuotes[0];
    const fee = feeQuote.fees.totals;
    console.log("total fee in usd:", `$${formatUnits(fee.feeTokenAmountInUSD, 18)}`);
    console.log("gas fee in usd:", `$${formatUnits(fee.gasFeeTokenAmountInUSD, 18)}`);
    console.log("service fee in usd:", `$${formatUnits(fee.transactionServiceFeeTokenAmountInUSD, 18)}`);
    console.log("lp fee in usd:", `$${formatUnits(fee.transactionLPFeeTokenAmountInUSD, 18)}`);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log("sendResult", sendResult);
    console.log("explorer url", `https://universalx.app/activity/details?id=${sendResult.transactionId}`);

    // wait for transaction to be confirmed
    for (let index = 0; index < 10; index++) {
        const transactionDetail = await universalAccount.getTransaction(sendResult.transactionId);
        if (transactionDetail.status === UA_TRANSACTION_STATUS.FINISHED) {
            console.log("transaction confirmed");
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
})();
