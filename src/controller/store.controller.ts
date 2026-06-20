import { Response } from "express";
import { IReqUser } from "../utils/jwt";
import response from "../utils/response";
import { isValidObjectId, Types } from "mongoose";
import ModelStore, { storeDTO } from "../model/store.model";
import ModelUser from "../model/user.model";

const storeController = {
    create: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!isValidObjectId(userId)) return response.unauthorized(res);

            const store = await ModelStore.findOne({
                ownerId: userId as Types.ObjectId
            });

            if(store) return response.error(res, "error sudah punya store", "failed to create store, because store has be");

            const validate = await storeDTO.validate(req.body);

            const payload = {
                name: validate.name,
                address: validate.address,
                phone: validate.phone,
                description: validate.description,
                ownerId: userId as Types.ObjectId
            }

            const result = await ModelStore.create(payload);

            const user = await ModelUser.findByIdAndUpdate(userId, {
                storeId: result._id
            }, {
                new: true
            });
            
            if(!user) return response.notFound(res, "user not found");
           

            response.success(res, result, "success to create store");

            
        } catch(error) {
            response.error(res, error, "failed to")
        }
    },

    findStoreByUser: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.unauthorized(res);

            const storeId = req.user?.storeId;
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const result = await ModelStore.findById(storeId);
            if(!result) return response.notFound(res, "store not found");

            response.success(res, result, "success to find a store by user")
        } catch(error) {
            response.error(res, error, "failed to find a store by user")
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try {
            const {storeId} = req.params;
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");            

            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.unauthorized(res);

            const result = await ModelStore.findOneAndUpdate({
                ownerId: userId as Types.ObjectId,
                _id: storeId
            }, req.body, {new:true});

            if(!result) return response.notFound(res, "store is not found");

            response.success(res, result, "succoss to update store");
        } catch(error) {
            response.error(res, error, "failed to update store")
        }
    },
}


export default storeController;