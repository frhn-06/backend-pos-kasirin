import dotenv from 'dotenv'

dotenv.config();



export const MONGO_URL = process.env.MONGO_URL || "";
export const SECRET = process.env.SECRET || "";

export const MAIL_ME = process.env.MAIL_ME || "";
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "";
export const CLIENT_HOST = process.env.CLIENT_HOST || "";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";