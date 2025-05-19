import { Request, Response } from 'express';
import { login, register, verifyTotpService } from '../services/auth.service';
import { loginSchema, registerSchema, verifyTotp } from '../validators/auth.validator';
import createHttpError from "http-errors";

export const registerController = async (req: Request, res: Response) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw createHttpError.BadRequest(error.details[0].message);
    }
  
    const result = await register(req);
    res.json(result);
};

export const loginController = async (req: Request, res: Response) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw createHttpError.BadRequest(error.details[0].message);
    }
  
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
};

export const verifyTotpController = async (req: Request, res: Response) => {
  const { error } = verifyTotp.validate(req.body);
  if (error) {
    throw createHttpError.BadRequest(error.details[0].message);
  }

  const { email, totp } = req.body;

  const result = await verifyTotpService(totp, email);
  res.json(result);
};