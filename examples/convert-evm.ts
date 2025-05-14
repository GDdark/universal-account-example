import { config } from 'dotenv';
import { CHAIN_ID, SUPPORTED_TOKEN_TYPE, UniversalAccount } from '@particle-network/universal-account-sdk';
import { getBytes, Wallet } from 'ethers';

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || '');
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || '',
        ownerAddress: wallet.address,
        tradeConfig: {
            universalGas: true,
        },
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const transaction = await universalAccount.createConvertTransaction({
        expectToken: { type: SUPPORTED_TOKEN_TYPE.USDC, amount: '0.0001' },
        chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE,
    });

    console.log('convert transaction', transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log('sendResult', sendResult);
    console.log('explorer url', `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
