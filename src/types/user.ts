export interface ICreateUser {
    email: string;
    password: string;
    walletAddress?: string;
    walletPrivateKey?: string;
    isCustodialWallet?: boolean;
    twoFASecret?: string;
    profileUrl?: string;
    name?: string;
    country?: string;
    ipAddress?: string;
    accountCreated?: Date;
    country_currency?: string;
    isTwoFaEnabled?: boolean;
    role?: string;
    isAccountDeactivatedByUser?: boolean;
    isWalletFreezeByAdmin?: boolean;
    isWalletBlacklistByAdmin?: boolean;
    isAccountDeactivateByAdmin?: boolean;
    isUserCreatedByAdmin?: boolean;
    tier?: string;  
    referral_code?: string;
    phone_number?:string;
}
