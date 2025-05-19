import mongoose, { Document, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { Role } from '../enums/role';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    profileUrl: string;
    country: string;
    country_currency: string;
    ipAddress: string;
    accountCreated: Date;
    walletAddress: string;
    walletPrivateKey: string;
    isCustodialWallet: boolean;
    createdAt: Date;
    updatedAt: Date;
    generateJWT(): string;
    twoFASecret: string;
    isTwoFaEnabled: boolean;
    role: Role;
    isAccountDeactivatedByUser: boolean;
    isWalletFreezeByAdmin: boolean;
    isWalletBlacklistByAdmin: boolean;
    isAccountDeactivateByAdmin: boolean;
    tier:string
    aggregator: string;
    referral_code: string;
    phone_number: number
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        phone_number: {
            type: Number,
        },
        profileUrl: {
            type: String,
        },
        country: {
            type: String,
        },
        country_currency: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        accountCreated: {
            type: Date,
            default: Date.now,
        },
        walletAddress: {
            type: String,
        },
        walletPrivateKey: {
            type: String,
        },
        isCustodialWallet: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER,
        },
        twoFASecret: {
            type: String,
        },
        isTwoFaEnabled: {
            type: Boolean,
            default: true,
        },
        isAccountDeactivatedByUser: {
            type: Boolean,
            default: false,
        },
        isWalletFreezeByAdmin: {
            type: Boolean,
            default: false,
        },
        isWalletBlacklistByAdmin: {
            type: Boolean,
            default: false,
        },
        isAccountDeactivateByAdmin: {
            type: Boolean,
            default: false,
        },
        tier: {
            type: String,
            default: 'Basic',
        },
        aggregator: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.generateJWT = function (): string {
    return jwt.sign(
        { _id: this._id, role: this.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
