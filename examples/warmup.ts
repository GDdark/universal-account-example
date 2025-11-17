import { config } from 'dotenv';
import { CHAIN_ID, UniversalAccount } from '@particle-network/universal-account-sdk';
import { Wallet } from 'ethers';

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || '');
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || '',
        projectClientKey: process.env.PROJECT_CLIENT_KEY || '',
        projectAppUuid: process.env.PROJECT_APP_UUID || '',
        ownerAddress: wallet.address,
        tradeConfig: {
            universalGas: true,
        },
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    const result = await universalAccount.getTokenPair({
        chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE,
        address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    });

    console.log('get token pair success');

    const transaction = await universalAccount.createBuyTransaction(
        {
            token: { chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, address: '0x912CE59144191C1204E64559FE8253a0e49E6548' },
            amountInUSD: '0.001',
        },
        {
            tokenPair: {
                address: result.pair.address,
                factory: result.pair.factory,
            },
        },
    );
    console.log('buy transaction', transaction);
})();
