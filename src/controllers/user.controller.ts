import { Request, Response } from 'express';
import createHttpError from "http-errors";
import { changePasswordValidator, toggle2FAValidator, updateImageUrlValidator, validateVerifySignature } from '../validators/user.validator';
import { changePassword, createWalletService, findUserById, verifySignMessageService, toggle2FA, updateImageUrlService, deactivateAccountByUserService, claimRewardService } from '../services/user.service';
import { CustomRequest } from '../middlewares/admin.middleware';
import { getAccountDetailsByUser } from '../services/account.service';
import { uploadImageToS3 } from '../utils/s3';
import { UploadedFile } from 'express-fileupload';

interface FileUploadRequest extends Request {
    files: {
        image: UploadedFile;
    };
}

export function getSignMessage(req: Request, res: Response) {
    res.json({ message: process.env.WALLET_SIGNIN_MESSAGE })
};

export async function verifySignMessage(req: Request, res: Response) {
    const { error } = validateVerifySignature(req.body);
    if (error) {
        throw createHttpError(400, error.details[0].message);
    }

    const sign = await verifySignMessageService(req);
    res.json(sign);
};

export const createWalletController = async (req: Request, res: Response) => {
    await createWalletService(req);
    res.json({
        message: "Wallet created successfully"
    });
};

export const getProfileDetailsController = async (req: CustomRequest, res: Response) => {
    const data = await findUserById(req.token._id);
    res.json({ data });
};

export const getAccountDetailsController = async (req: CustomRequest, res: Response) => {
    const data = await getAccountDetailsByUser(req.token._id);
    res.json({ data })
};

export const changePasswordController = async (req: CustomRequest, res: Response) => {
    const { error } = changePasswordValidator.validate(req.body);
    if (error) {
        throw createHttpError(400, error.details[0].message);
    }
    const userId = req.token._id;
    const { oldPassword, newPassword } = req.body;

    await changePassword(userId, oldPassword, newPassword);

    res.json({ message: 'Password updated successfully' });
};

export const toggle2FAController = async (req: CustomRequest, res: Response) => {
    const { error } = toggle2FAValidator.validate(req.body);
    if (error) {
        throw createHttpError(400, error.details[0].message);
    }

    const userId = req.token._id;
    const { enable2FA } = req.body;

    await toggle2FA(userId, enable2FA);

    res.status(200).json({
        message: `Two-Factor Authentication ${enable2FA ? 'enabled' : 'disabled'} successfully.`,
    });
};

export const uploadImage = async (req: FileUploadRequest, res: Response) => {
    if (!req.files || !req.files.image) {
        throw createHttpError(400, "No image file provided");
    }

    const image = req.files.image;
    const mimeType = image.mimetype;
    const buffer = image.data;

    const url = await uploadImageToS3(buffer, mimeType, "uploads");
    res.json({ url })
};

export const updateImageUrl = async (req: CustomRequest, res: Response) => {
    const { error } = updateImageUrlValidator.validate(req.body);
    if (error) {
        throw createHttpError(400, error.details[0].message);
    }

    await updateImageUrlService(req.token._id, req.body.imageUrl);

    res.json({
        message: `Image unload successfully`,
    });
}

export const deactivateAccountByUser = async (req: CustomRequest, res: Response) => {
    await deactivateAccountByUserService(req.token._id);
    res.json({
        message: "User account is deactivate"
    })
};

export const claimReward = async (req: CustomRequest, res: Response) => {
    await claimRewardService(req.token._id);
    res.json({
        message: "Reward claim successfully"
    })
};
