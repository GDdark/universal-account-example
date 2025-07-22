import { config } from "dotenv";
import { UniversalAccount, createUnsignedMessage } from "@particle-network/universal-account-sdk";
import { Wallet } from "ethers";
import { randomUUID } from "node:crypto";

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || "");
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        ownerAddress: wallet.address,
        projectClientKey: process.env.PROJECT_CLIENT_KEY || "",
        projectAppUuid: process.env.PROJECT_APP_UUID || "",
    });

    // this is optional
    const invitationCode = "000000";

    // you only need to register once
    const smartAccountOptions = await universalAccount.getSmartAccountOptions();

    const deviceId = randomUUID();
    const timestamp = Date.now();
    const message = createUnsignedMessage(smartAccountOptions.smartAccountAddress as string, deviceId, timestamp);
    const signature = wallet.signMessageSync(message);

    const result = await universalAccount.register(invitationCode, deviceId, timestamp, signature);
    if (!!result.token) {
        console.log("register success");
    } else {
        console.log("register failed", result);
    }
})();
