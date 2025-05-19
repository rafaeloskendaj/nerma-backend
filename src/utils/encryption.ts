import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
  .createHash('sha256')
  .update(String(process.env.ENCRYPTION_SECRET))
  .digest(); 

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  const ivHex = iv.toString('hex');
  return `${ivHex}:${encrypted}`;
};

export const decrypt = (data: string): string => {
  const [ivHex, encryptedText] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};
