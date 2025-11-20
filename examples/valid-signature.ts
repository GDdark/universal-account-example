import { config } from 'dotenv';
import { UniversalAccount } from '@particle-network/universal-account-sdk';
import { Contract, getBytes, hashMessage, JsonRpcProvider, Wallet } from 'ethers';


config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || '');
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || '',
        projectClientKey: process.env.PROJECT_CLIENT_KEY || '',
        projectAppUuid: process.env.PROJECT_APP_UUID || '',
        ownerAddress: wallet.address,
        tradeConfig: {
            // if this is not set, will use auto slippage
            slippageBps: 100, // 100 means 1%, max is 10000
            // use parti to pay fee
            universalGas: true,
            // can use specific token to pay
        },
    });

    const message = 'helloWorld';
    const dataHash = hashMessage(message);
    const signature = wallet.signMessageSync(getBytes(dataHash));
    const result = await universalAccount.getUniversalSignature(dataHash, signature);
    console.log(JSON.stringify(result, null, 2));

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    const isValid = await validateUniversalSignature(smartAccountOptions, dataHash, result, process.env.RPC_URL as string);
    console.log('isValid', isValid);
})();

async function validateUniversalSignature(
    smartAccountOptions: any,
    dataHash: string,
    universalSignature: string,
    rpcUrl: string,
): Promise<boolean> {
    const provider = new JsonRpcProvider(rpcUrl);

    const code = await provider.getCode(smartAccountOptions.smartAccountAddress as string);
    if (!code || code === '0x') {
        throw new Error(`Contract is not deployed at address: ${smartAccountOptions.smartAccountAddress}, please send a transaction first.`);
    }

    const abi = `function isValidSignature(bytes32 dataHash, bytes memory signature) public view override returns (bytes4)`;
    const contract = new Contract(smartAccountOptions.smartAccountAddress as string, [abi], provider);
    const isValid = await contract.isValidSignature(dataHash, universalSignature);
    return isValid === '0x1626ba7e';
}
