import mongoose, { isValidObjectId, ObjectId, QueryFilter, Types } from "mongoose";
import { IReqUser } from "../utils/jwt";
import {Response} from 'express'
import response from "../utils/response";
import ModelProduct, { IProduct, productDTO } from "../model/product.model";
import ModelUser from "../model/user.model";

const productController = {
    create : async(req: IReqUser, res: Response) => {
        try{
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.notFound(res, "user is not found");

            const user = await ModelUser.findById(userId);
            if(!user) return response.notFound(res, "user is not found");
            if(!user.storeId) return response.notFound(res, "store id of user is not found");

            const validate = await productDTO.validate(req.body);

            const result = await ModelProduct.create({
                name: validate.name,
                img: validate.img,
                price: validate.price,
                categoryId: validate.categoryId as unknown as Types.ObjectId,
                storeId: user.storeId,
            });

            response.success(res, result, "success to create product");
            
        }catch(error) {
            response.error(res, error, "failed to create product")
        }
    },
    findAll : async(req: IReqUser, res: Response) => {
        try{
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.notFound(res, "user is not found");

            const user = await ModelUser.findById(userId);
            if(!user) return response.notFound(res, "user is not found");
            if(!user.storeId) return response.notFound(res, "store id of user is not found");

            const {page = 1, limit = 10, search, category} = req.query as {page : string | number, limit: string | number; search: string, category: string}

            const setQuery = (params: Record<string, unknown>) => {
                let query : QueryFilter<IProduct> = {} 
                if(search) {
                    query.$text = {
                        $search: params.search
                    }
                }

                if(category) {
                    query.categoryId = params.category as unknown as string
                }

                return query
            }

            const query = setQuery({search, category});

            const result = await ModelProduct.find({
                ...query,
                storeId: user.storeId,
                isDeleted: false
            }).populate("categoryId", "name").limit(+limit).skip((+page - 1) * +limit).sort({name: 1}).exec();

            const totalProduct = await ModelProduct.countDocuments({
                ...query,
                storeId: user.storeId
            });

            response.pagination(res, result, {totalPage: Math.ceil(totalProduct / +limit), total: totalProduct, currentPage: +page}, "success to find all product")

        }catch(error) {
            response.error(res, error, "failed to find all product")
        }
    },
    findOne : async(req: IReqUser, res: Response) => {
        try{
            const {productId} = req.params;
            if(!isValidObjectId(productId)) return response.notFound(res, "product is not found");

            const result = await ModelProduct.findById(productId);

            if(!result) return response.notFound(res, "product is not found");

            response.success(res, result, "success to find one product")
            
        }catch(error) {
            response.error(res, error, "failed to find one product")
        }
    },
    update : async(req: IReqUser, res: Response) => {
        try{
            const {productId} = req.params;
            if(!isValidObjectId(productId)) return response.notFound(res, "product is not found");

            const result = await ModelProduct.findByIdAndUpdate(productId, req.body, {new:true})

            response.success(res, result, "success to update product");
        }catch(error) {
            response.error(res, error, "failed to update product")
        }
    },
    remove : async(req: IReqUser, res: Response) => {
        try{
            const {productId} = req.params;
            if(!isValidObjectId(productId)) return response.notFound(res, "product is not found");

            const result = await ModelProduct.findByIdAndDelete(productId)

            response.success(res, result, "success to remove product");
        }catch(error) {
            response.error(res, error, "failed to remove product")
        }
    },
}

export default productController;