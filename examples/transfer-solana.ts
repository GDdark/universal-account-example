import { config } from 'dotenv';
import { CHAIN_ID, UniversalAccount } from '@particle-network/universal-account-sdk';
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

    const transaction = await universalAccount.createTransferTransaction({
        // 0x0000000000000000000000000000000000000000 means native token
        // so here we transfer solana native token to the receiver address
        token: { chainId: CHAIN_ID.SOLANA_MAINNET, address: '0x0000000000000000000000000000000000000000' },
        // transfer 0.000001 solana native token
        amount: '0.000001',
        // the receiver address, it must be a solana address
        receiver: 'GRHXQJsDHzc9J9trV6aThaH2V924yTra9aFa8MdpUDux',
    });

    console.log('transfer transaction', transaction);

    const sendResult = await universalAccount.sendTransaction(transaction, wallet.signMessageSync(getBytes(transaction.rootHash)));

    console.log('sendResult', sendResult);
    console.log('explorer url', `https://universalx.app/activity/details?id=${sendResult.transactionId}`);
})();
