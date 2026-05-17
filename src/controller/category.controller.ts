import { Response } from "express";
import { IReqUser } from "../utils/jwt";
import ModelCategory, { categoryDTO } from "../model/category.model";
import response from "../utils/response";
import ModelUser from "../model/user.model";
import { isValidObjectId, Types } from "mongoose";

const categoryController = {
    create: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const validate = await categoryDTO.validate(req.body);

            const user = await ModelUser.findById(userId);
            if(!user?.storeId) return response.notFound(res, "storeId not found");

            const payload = {
                name: validate.name,
                img: validate.img,
                storeId: user.storeId as Types.ObjectId
            }
    
            const result = await ModelCategory.create(payload);

            response.success(res, result, "success to create category")

        } catch(error) {
            return response.error(res, error, "failed to create category")
        }
    },

    findAllByStoreId: async(req: IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const user = await ModelUser.findById(userId);
            if(!user?.storeId) return response.notFound(res, "storeId not found");

            const result = await ModelCategory.find({
                storeId: user.storeId
            }).sort({name: 1}).exec();

            response.success(res, result, "success to find all category by storeid")
            
        } catch(error) {
            response.error(res, error, "failed to find all category by storeid")
        }
    },

    findById: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const {categoryId} = req.params;

            const result = await ModelCategory.findById(categoryId)

            if(!result) return response.notFound(res, "category not found");

            response.success(res, result, "success to find category by id");
        } catch(error) {
            response.error(res, error, "failed to find category by id")
        }
    },

    update: async(req: IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const {categoryId} = req.params;

            const result = await ModelCategory.findByIdAndUpdate(categoryId, req.body, {new:true});

            if(!result) return response.notFound(res, "category not found");

            response.success(res, result, "success to update category");
        } catch(error) {
            response.error(res, error, "failed to update category")
        }
    },

    remove: async(req: IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const {categoryId} = req.params;

            const result = await ModelCategory.findByIdAndDelete(categoryId);

            if(!result) return response.notFound(res, "category not found");

            response.success(res, result, "success to remove category");
        } catch(error) {    
            response.error(res, error, "failed to remove category")
        }
    }
}


export default categoryController;