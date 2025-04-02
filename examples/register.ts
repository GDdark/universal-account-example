import { config } from "dotenv";
import { UniversalAccount } from "@GDdark/universal-account";

config();

(async () => {
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || "",
        privateKey: process.env.PRIVATE_KEY || "",
    });

    // this is optional
    const invitationCode = "000000";

    // you only need to register once
    const result = await universalAccount.register(invitationCode);
    if (!!result) {
        console.log("register success");
    }
})();
