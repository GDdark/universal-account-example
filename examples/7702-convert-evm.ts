import { config } from 'dotenv';
import { CHAIN_ID, IUniversalAccountConfig, SUPPORTED_TOKEN_TYPE, UNIVERSAL_ACCOUNT_VERSION, UniversalAccount } from '@particle-network/universal-account-sdk';
import { getBytes, Wallet } from 'ethers';

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || '');
    const universalAccountConfig: IUniversalAccountConfig = {
        projectId: process.env.PROJECT_ID || "",
        projectClientKey: process.env.PROJECT_CLIENT_KEY || "",
        projectAppUuid: process.env.PROJECT_APP_UUID || "",
        smartAccountOptions: {
            useEIP7702: true,
            name: "UNIVERSAL",
            version: process.env.UNIVERSAL_ACCOUNT_VERSION || UNIVERSAL_ACCOUNT_VERSION,
            ownerAddress: wallet.address,
        },
    };

    const universalAccount = new UniversalAccount(universalAccountConfig);
    const transaction = await universalAccount.createConvertTransaction({
        expectToken: { type: SUPPORTED_TOKEN_TYPE.USDT, amount: '0.0001' },
        chainId: CHAIN_ID.BSC_MAINNET,
    }, {
        usePrimaryTokens: [SUPPORTED_TOKEN_TYPE.ETH]
    });

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log('sendResult', sendResult);
    console.log('sendResult.transactionId', sendResult.transactionId);
    console.log('explorer url', `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
