import { Authorization, JsonRpcProvider, Wallet, ZeroAddress } from "ethers";
import { config } from "dotenv";
import { UniversalAccount, IUniversalAccountConfig, UNIVERSAL_ACCOUNT_VERSION } from "@particle-network/universal-account-sdk";

config();

(async () => {
    const targetChainId = 56;
    const rpcUrl = process.env[`EVM_RPC_${targetChainId}`] || "";
    console.log('rpcUrl', rpcUrl);

    const provider = new JsonRpcProvider(rpcUrl);
    const signer = new Wallet(process.env.PRIVATE_KEY || "", provider);
    const universalAccountConfig: IUniversalAccountConfig = {
        projectId: process.env.PROJECT_ID || "",
        projectClientKey: process.env.PROJECT_CLIENT_KEY || "",
        projectAppUuid: process.env.PROJECT_APP_UUID || "",
        smartAccountOptions: {
            useEIP7702: true,
            name: "UNIVERSAL",
            version: process.env.UNIVERSAL_ACCOUNT_VERSION || UNIVERSAL_ACCOUNT_VERSION,
            ownerAddress: signer.address,
        },
    };

    const universalAccount = new UniversalAccount(universalAccountConfig);

    const deployments = await universalAccount.getEIP7702Deployments();
    console.log(deployments);

    const deployment = deployments.find((d: any) => d.chainId === targetChainId);
    if (!deployment.isDelegated) {
        const auth = await universalAccount.getEIP7702Auth(targetChainId);
        console.log(auth);

        const singerCurrentNonce = auth.nonce;
        auth.nonce = singerCurrentNonce + 1;

        let authWithSignature: Authorization = signer.authorizeSync(auth);
        console.log(authWithSignature);

        try {
            const tx = await signer.sendTransaction({
                to: ZeroAddress,
                type: 4,
                authorizationList: [authWithSignature],
                nonce: singerCurrentNonce,
                maxFeePerGas: Math.floor(0.1 * 10 ** 9),
                maxPriorityFeePerGas: Math.floor(0.1 * 10 ** 9),
            });
            console.log({ tx });

            const receipt = await tx.wait();
            console.log({ receipt });
        } catch (e) {
            console.dir(e, { depth: null });
        }
    }
})();
