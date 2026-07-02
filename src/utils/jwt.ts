import jwt from 'jsonwebtoken'
import { IUser } from '../model/user.model'
import { SECRET } from './env';
import { Types } from 'mongoose';
import { Request } from 'express';

interface IUserToken extends Omit<IUser, "userName"| "fullName" | "email" | "activationCode" | "password" | "isActive" | "avatar" | "createdAt" | "updatedAt" > {
    id: Types.ObjectId;
    storeId: Types.ObjectId | null;
}

interface IReqUser extends Request {
    user? : IUserToken
}

const signIn = (user: IUserToken) => {
    return jwt.sign(user, SECRET, {
        expiresIn: "1m"
    });
}

const getUserByToken = (token: string) => {
    return jwt.verify(token, SECRET) as IUserToken
}


export type {IUserToken, IReqUser}
export {signIn, getUserByToken}
