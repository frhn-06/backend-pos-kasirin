import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
import { getUserByToken, IUserToken } from "../utils/jwt";

interface IReqUser extends Request {
    user: IUserToken;
}

const authMiddleware = async (req:Request, res:Response, next: NextFunction) => {
    const authorize = req.headers.authorization;

    if(!authorize) return response.unauthorized(res);

    const [bearer, token] = authorize.split(" ");

    if(bearer !== "Bearer") return response.unauthorized(res);

    if(!token) return response.unauthorized(res);

    const result = getUserByToken(token);

    (req as unknown as IReqUser).user = result
    
    next();
}

export default authMiddleware;
