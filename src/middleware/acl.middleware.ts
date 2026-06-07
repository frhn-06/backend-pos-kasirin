import { NextFunction, Response } from "express"
import { IReqUser } from "../utils/jwt"
import response from "../utils/response";

const aclMiddleware = (roles: string[]) => {
    return (req:IReqUser, res:Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if(!userRole) {
            return response.unauthorized(res);
        }

        if(!roles.includes(userRole)) {
            return response.forbidden(res);
        }

        next();
    }
}

export default aclMiddleware;