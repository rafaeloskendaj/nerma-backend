import { createUser, findUserByEmail } from "../services/user.service";
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { encrypt } from "../utils/encryption";
import { Role } from "../enums/role";
import { ICreateUser } from "../types/user";
import { logger } from "./logger";
import { upsertAdminConfig } from "../services/admin.service";

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_WALLET_ADDRESS, ADMIN_WALLET_PVKEY } = process.env;

export const createAdmin = async () => {
    const adminExist = await findUserByEmail(ADMIN_EMAIL);
    if(!adminExist) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
        const twoFASecret = speakeasy.generateSecret({ length: 20 });
    
        const encryptPvKey = encrypt(ADMIN_WALLET_PVKEY);
    
        logger.info(`Admin 2fa key ${twoFASecret.base32}`);
    
        const data: ICreateUser = {
            email: ADMIN_EMAIL,
            password: hashedPassword,
            walletAddress: ADMIN_WALLET_ADDRESS,
            walletPrivateKey: encryptPvKey,
            isCustodialWallet: true
        }
    
        await createUser(data, Role.ADMIN);
    
        logger.info("Admin created successfully");
    }
};

export const addRewardPercentage = async () => {
    const basic = 1;
    const premium = 3;
    const premiumPlus = 5;

    const data = {
        basicTierPercentage : basic,
        premiumTierPercentage : premium,
        premiumPlusTierPercentage : premiumPlus
    };
    
    await upsertAdminConfig(data);
};  