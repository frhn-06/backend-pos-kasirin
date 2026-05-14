import { Request, Response } from "express";
import ModelUser, { IRegisterForm, LoginDTO, UserDTO } from "../model/user.model";
import response from "../utils/response";
import { signIn } from "../utils/jwt";
import encrypt from "../utils/encrypt";

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
    },

    activation: async (req:Request, res:Response) => {
        try {
            const {code} = req.body;

            if(!code) {
                return response.error(res, "not found", "code is notfound")
            }

            const result = await ModelUser.findOneAndUpdate({
                activationCode: code
            }, {
                isActive: true
            }, {
                new: true
            });

            if(!result) {
                return response.notFound(res, "user is notfound")
            }


            response.success(res, result, "success to activation account");
            

        } catch (error) {
            response.error(res, error, "failed to activation")
        }
    }, 

    login: async(req:Request, res:Response) => {
        try {
            const {identifier, password} = req.body;
            const validate = await LoginDTO.validate({identifier, password});

            const user = await ModelUser.findOne({
                $or: [
                    {
                        userName: validate.identifier
                    },
                    {
                        email: validate.identifier
                    }
                ],
                isActive: true
            });


            if(!user) return response.notFound(res, "akun tidak ditemukan ");

            const passwordMatch = encrypt(validate.password) === user.password;

            if(!passwordMatch) return response.error(res, "password is wrong", "failed to login");

            const result = await signIn({
                id: user._id
            })
          
            response.success(res, result, "success to login");
        } catch(error) {
            response.error(res, error, "failed to login")
        }
    } 
}

export default authController;