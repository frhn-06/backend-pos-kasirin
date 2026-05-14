import { Request, Response } from "express";
import ModelUser, { IRegisterForm, UserDTO } from "../model/user.model";
import response from "../utils/response";

const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const {userName, fullName, email, password, confirmPassword} = req.body as IRegisterForm
            const validate = await UserDTO.validate({userName, fullName, email, password, confirmPassword})

            const result = await ModelUser.create({userName: validate.userName, fullName: validate.fullName, email:validate.email, password: validate.password});

            response.success(res, result, "success to register");
            
        } catch(error) {
            response.error(res, error, "failed to register")
        }
    }
}

export default authController;