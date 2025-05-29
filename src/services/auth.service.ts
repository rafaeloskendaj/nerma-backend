import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import speakeasy from 'speakeasy';
import { decrypt } from '../utils/encryption';
import { createUser, findUserByEmail, findUserByReferralCode } from './user.service';
import { ICreateUser } from '../types/user';
import requestIp from 'request-ip';
import { lookupCountryByIP } from '../utils/geoip';
import { createReferral, generateReferralCode } from './referral.service';
import { createOtp, generateOtp, getLatestOtp } from "./otp.service";
import { sendEmail } from "./nodemailer.service";

export const register = async (req) => {
    const { email, password, name, phone_number, referralCode = '' } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw createHttpError.BadRequest('User already exists');

    let referrerId: unknown = '';
    if (referralCode.length > 0) {
        const referrer = await findUserByReferralCode(referralCode);
        referrerId = referrer._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ip = requestIp.getClientIp(req);
    const { country, currency } = await lookupCountryByIP(ip);

    const referral_code = generateReferralCode();

    const data: ICreateUser = {
        email,
        password: hashedPassword,
        country,
        country_currency: currency,
        ipAddress: ip,
        referral_code,
        name,
        phone_number
    }

    const newUser = await createUser(data);

    if (referrerId) {
        await createReferral(referrerId, newUser._id);
    }

    return { message: 'User registered successfully' };
};

export const login = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw createHttpError.BadRequest("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError.BadRequest("Invalid credentials");

    if (!user.isTwoFaEnabled) {
        const jwtToken = user.generateJWT();

        return { token: jwtToken, message: 'User login successfully' };
    } else {
        return { message: "Check you authenticator app for totp" }
    }
};

export const verifyTotpService = async (totp: string, email: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw createHttpError.BadRequest('Invalid credentials');

    const decrypt2fa = decrypt(user.twoFASecret);

    const verified = speakeasy.totp.verify({
        secret: decrypt2fa,
        token: totp,
        encoding: "base32",
    });

    console.log(verified, "verified");
    if (!verified) throw createHttpError.BadRequest("Invalid 2FA token");

    const jwtToken = user.generateJWT();

    return { token: jwtToken, message: 'User login successfully' };
};

export const sendOtpService = async (type: string, value) => {
    let otp = generateOtp();

    if (type === "email") {
        const user = await findUserByEmail(value);
        const existOtp = await getLatestOtp(user._id, type);

        if(existOtp) {
            otp = existOtp.otp
        } else {
            const data = {
                user: user._id,
                otp,
                type: "email",
                expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            };
    
            await createOtp(data)
        }

        console.log(`Sending OTP ${otp} to email: ${value}`);

        await sendEmail({
            email: value,
            purpose: "signup",
            otp
        });

    } else {
        console.log(`Sending OTP ${otp} to phone: ${value}`);
        // await sendSMS(value, otp);
    }
};

export const verifyOtp = async (email: string, otp: string, type: "email" | "phone") => {
    const user = await findUserByEmail(email);
    console.log(user, email)
    const existOtp = await getLatestOtp(user._id, type)

    console.log(existOtp, "---")
    if (!existOtp) {
        throw createHttpError.BadRequest("Invalid Otp")
    }

    if (existOtp.otp === otp) {
        existOtp.verified = true;
        await existOtp.save();

        const jwtToken = user.generateJWT();
        return { token: jwtToken, message: 'User login successfully' };
    } else {
        throw createHttpError.BadRequest("Invalid Otp")
    }

};
