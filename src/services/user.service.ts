import User from "../models/User.model";
import { Role } from "../enums/role";
import { ICreateUser } from "../types/user";
import createHttpError from "http-errors";
import { ethers } from "ethers";
import { createWeb3Wallet } from "../utils/web3";
import { encrypt } from "../utils/encryption";
import bcrypt from 'bcryptjs';
import { getUserConfig } from "./userConfig.service";
import { getDecimals, transferToken } from "./web3.service";
import { sendEmail } from "./nodemailer.service";
import { createTransaction } from "./reward.service";

export const findUserById = async (id: unknown) => await User.findById(id);

export const createUser = async (
    data: ICreateUser,
    role: string = Role.USER,
    isUserCreatedByAdmin = false
) => {
    const existingUser = await findUserByEmail(data.email);

    if (!existingUser && role !== Role.ADMIN && isUserCreatedByAdmin === false) {
        return await User.create(data);
    }

    if (!existingUser && role === Role.ADMIN && isUserCreatedByAdmin === false) {
        await User.create({
            email: data.email,
            password: data.password,
            twoFASecret: data.twoFASecret,
            walletAddress: data.walletAddress,
            walletPrivateKey: data.walletPrivateKey,
            isCustodialWallet: true,
            role: Role.ADMIN,
        });
    }

    if (isUserCreatedByAdmin) {
        const newData = { ...data, isUserCreatedByAdmin: isUserCreatedByAdmin, role };
        return await User.create(newData);
    }
};

export const findUserByEmail = async (email: string) =>
    await User.findOne({ email });

export async function verifySignMessageService(req) {
    const user = await findUserById(req.token._id);

    const recoveredAddress = ethers.verifyMessage(
        process.env.WALLET_SIGNIN_MESSAGE,
        req.body.signature
    );
    const result =
        recoveredAddress.toLowerCase() === req.body.address.toLowerCase();

    if (result) {
        user.walletAddress = recoveredAddress.toLowerCase();
        await user.save();

        return { message: "Wallet Connected Successfully" };
    } else {
        throw new createHttpError.BadRequest("Invalid token");
    }
}

export async function createWalletService(req) {
    const user = await findUserById(req.token._id);

    if (user.walletAddress) {
        throw new createHttpError.BadRequest("Wallet already exist");
    }

    const wallet = createWeb3Wallet();
    const encryptPvKey = encrypt(wallet.privateKey);

    user.isCustodialWallet = true;
    user.walletAddress = wallet.address;
    user.walletPrivateKey = encryptPvKey;

    await user.save();
}

export async function updateUserTier(tier: string, email: string) {
    const user = await findUserByEmail(email);
    user.tier = tier;
    await user.save();
}

export async function getUsersByTier(tier: string) {
    return await User.find({ tier, aggregator: "PLAID" });
}

export async function updateIsPlaidFlag(id) {
    const user = await findUserById(id);
    user.aggregator = "PLAID";
    await user.save();
}

export async function getUsers(filter, options) {
    return await User.paginate(filter, options);
}

export const changePassword = async (
    userId: unknown,
    oldPassword: string,
    newPassword: string
) => {
    const user = await findUserById(userId);

    if (!user) {
        throw createHttpError.NotFound('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw createHttpError.BadRequest('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
};

export const toggle2FA = async (userId: unknown, enable2FA: boolean) => {
    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError.NotFound('User not found');
    }

    user.isTwoFaEnabled = enable2FA;
    await user.save();
};

export const updateImageUrlService = async (userId: unknown, imageUrl: string) => {
    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError.NotFound('User not found');
    }

    user.profileUrl = imageUrl;
    await user.save();
};

export const findUserByReferralCode = async (referralCode: string) => {
    const user = await User.findOne({ referral_code: referralCode });
    if (!user) {
        throw createHttpError.BadRequest("Invalid Referral code ")
    }

    return user;
}

export const deactivateAccountByUserService = async (userId: unknown) => {
    const user = await findUserById(userId);
    user.isAccountDeactivatedByUser = true;
    await user.save();
};

export const claimRewardService = async (userId: unknown) => {
    const reward = await getUserConfig(userId);
    const user = await findUserById(userId);

    const totalReward = reward.totalReward + reward.refereeReward + reward.totalReferralReward;

    if (totalReward > 0) {
        const decimal = await getDecimals();
        const amountInWei = totalReward * 10 ** Number(decimal);
        const amountInBigInt = BigInt(amountInWei);

        const result = await transferToken(user.walletAddress, amountInBigInt);

        if (result.status === 1) {
            reward.totalReward = 0
            reward.refereeReward = 0
            reward.totalReferralReward = 0
            reward.claimedReward = totalReward;

            await reward.save();

            const data = {
                userId,
                amount: amountInWei,
                transactionHash: result.hash,
                userWalletAddress: result.from
            }

            await createTransaction(data);
        }
    }
};

export async function toggleUserAccount(email: string) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw createHttpError(404, `User not found ${email}`);
    }

    user.isAccountDeactivateByAdmin = !user.isAccountDeactivateByAdmin;
    await user.save();

    await sendEmail({
        email: user.email,
        walletAddress: user.walletAddress,
        purpose: user.isAccountDeactivateByAdmin
            ? "deActivateAccount"
            : "ActivateAccount",
    });
    return user.isAccountDeactivateByAdmin
        ? "deActivateAccount"
        : "ActivateAccount";
}

export async function updateWallet(
    walletAddress: string,
    privateKey: string,
    id: string
) {
    const user = await findUserById(id);
    const encryptedkey = encrypt(privateKey);
    user.walletAddress = walletAddress;
    user.walletPrivateKey = encryptedkey;
    await user.save();
    return true;
}

export const findUserByWalletAddress = async (walletAddress: string) =>
    await User.findOne({ walletAddress });

export const getAllUsers = async () => await User.find();