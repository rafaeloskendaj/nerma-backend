import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
console.log(path.resolve(__dirname, `.env`) )
dotenv.config({ path: path.resolve(__dirname, `../.env}`) });

console.log(`Loaded environment variables from .env.${env}`);
