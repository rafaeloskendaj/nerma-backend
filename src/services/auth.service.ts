import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { decrypt, encrypt } from '../utils/encryption';
import { createUser, findUserByEmail } from './user.service';
import { ICreateUser } from '../types/user';
import requestIp from 'request-ip';
import { lookupCountryByIP } from '../utils/geoip';

export const register = async (req) => {
    const { email, password, name, phone_number } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw createHttpError.BadRequest('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const twoFASecret = speakeasy.generateSecret({ length: 20 });

    const ip = requestIp.getClientIp(req);
    const { country, currency } = await lookupCountryByIP(ip);

    const encryptTwoFA = encrypt(twoFASecret.base32);
  
    const data: ICreateUser = {
        email,
        password: hashedPassword,
        twoFASecret: encryptTwoFA,
        country,
        country_currency: currency,
        ipAddress: ip,
        name,
        phone_number
    }

    await createUser(data);

    const qrCode = await qrcode.toDataURL(twoFASecret.otpauth_url);

    return { message: 'User registered successfully', qrCode, twoFASecret: twoFASecret.base32 };
};

export const login = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw createHttpError.BadRequest('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError.BadRequest('Invalid credentials');

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
        encoding: 'base32',
    });

    console.log(verified, "verified");
    if (!verified) throw createHttpError.BadRequest('Invalid 2FA token');

    const jwtToken = user.generateJWT();

    return { token: jwtToken, message: 'User login successfully' };
};