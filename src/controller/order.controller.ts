import { IReqUser } from "../utils/jwt";
import { Response } from "express";
import response from "../utils/response";
import ModelOrder, { EnumStatus, IOrder, orderDTO } from "../model/order.model";
import ModelProduct from "../model/product.model";
import { isValidObjectId, QueryFilter } from "mongoose";
import convert from "../utils/convert";
import { object } from "yup";
import ModelStore from "../model/store.model";
import ModelUser from "../model/user.model";

const orderController = {
    create: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res,"user not found");
            if(!isValidObjectId(userId)) return response.notFound(res,"user not found");
            
            const {items, paymentMethod, paidAmount} = req.body as {items: {productId: string; qty: number}[]; paidAmount: number; paymentMethod: string};

            const validate = await orderDTO.validate({items, paymentMethod, paidAmount});

            const productsId = validate.items.map((item) => item.productId);

            // buat [products]
            const products = await ModelProduct.find({
                _id: {
                    $in: productsId
                }
            });

            // bikin map prodcut untuk field items
            const productMap = new Map(
                products.map((product) => {
                    return [product._id.toString(), product]
                })
            )


            // bikin field items
            const orderItems = validate.items.map((item) => {
                const product = productMap.get(item.productId);

                if(!product) throw new Error("product is not found");

                return {
                    productId: product._id,
                    productName: product.name,
                    price: product.price,
                    qty: item.qty,
                    subTotal: product.price * item.qty
                }
            });

            // bikin field totalAmount
            const totalAmount = orderItems.reduce((sum, item) => {
                return sum + item.subTotal;
            }, 0);

            // bikin field changeAmount
            let finalPaidAmount = validate.paidAmount;
            let changeAmount = 0;
            
            if(validate.paymentMethod === "cash") {                
                if(finalPaidAmount < totalAmount) return response.error(res, "payment is less than total price", "payment is less than total price")
                
                changeAmount = finalPaidAmount - totalAmount;
            } else {
                finalPaidAmount = totalAmount
            }
            
            // bikin field cashierId
            const cashierId = userId;

            // bikin field cashierSnapshot
            const cashier = await ModelUser.findById(cashierId);
            if(!cashier) return response.notFound(res,"cashier not found");

            const cashierSnapshot = {
                name: cashier.fullName
            }

            // nikin field storeId
            const storeId = req.user?.storeId
            if(!storeId) return response.notFound(res,"store not found");

            // bikin field storeSnapshot
            const store = await ModelStore.findById(storeId);
            if(!store) return response.notFound(res,"store not found");
            const storeSnapshot = {
                name: store.name,
                order: store.logo || "",
                address: store.address,
                phone: store.phone
            }
            
            // bikin field orderNumber
            const orderNumber = convert.generateOrderNum();

            

            const payload = {
                items: orderItems,
                paymentMethod: validate.paymentMethod,
                paidAmount: finalPaidAmount,
                storeSnapshot: storeSnapshot,
                cashierSnapshot: cashierSnapshot,
                totalAmount: totalAmount,
                changeAmount: changeAmount,
                cashierId: cashierId,
                storeId: storeId,
                orderNumber: orderNumber,
                status: EnumStatus.paid 
            }

            const result = await ModelOrder.create(payload)
            
            response.success(res, result, "success to create order")

        } catch(error) {
            return response.error(res, error, "failed to create order");
        }
    },

    findAllOrders: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user not found");

            const storeId = req.user?.storeId;
            if(!storeId) return response.notFound(res, "store is not found");

            const role = req.user?.role;

            interface TypeReqQuery {
                page:string; limit: string; search: string; status: string; paymentmethod: string; cashierid: string; start: string; end: string;
            }
            
            const {page, limit, search, status, paymentmethod, cashierid, start, end} = req.query as unknown as TypeReqQuery;

            const setQuery = (obj: TypeReqQuery) => {
                let query : QueryFilter<IOrder> = {}
                
                if(role === "cashier") query.cashierId = userId;

                if(role !== "cashier" && obj.cashierid) query.cashierId = obj.cashierid;

                if(obj.search) query.orderNumber = {
                    $regex: obj.search,
                    $options: "i"
                };
                
                if(obj.paymentmethod) query.paymentMethod = obj.paymentmethod as any;
                
                if(obj.status) query.status = obj.status as any;

                const dateFilter : any = {}

                if(obj.start) dateFilter.$gte = new Date(obj.start);

                if(obj.end) dateFilter.$lte = new Date(obj.end);

                if(Object.keys(dateFilter).length > 0) query.createdAt = dateFilter;

                return query;
            }

            const query = setQuery({page, limit, search, status, paymentmethod, cashierid, start, end});

            const result = await ModelOrder.find({
                ...query,
                storeId: storeId
            }).limit(+limit).skip((+page - 1) * +limit).sort({createdAt: -1}).exec();

            const totalOrder = await ModelOrder.countDocuments({
                ...query,
                storeId: storeId
            });

            response.pagination(res, result, {total: totalOrder, totalPage: Math.ceil(totalOrder / +limit), currentPage: +page}, "sucess find all orders");

        } catch(error) {
            return response.error(res, error, "failed to find all order");
        }
    },

    findOneById: async (req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");

            const storeId = req.user?.storeId;
            if(!storeId) return response.notFound(res, "store is not found");

            const {orderId} = req.params;
            if(!isValidObjectId(orderId)) return response.notFound(res, "order is not found");

            const role = req.user?.role;
            if(!role) return response.unauthorized(res);
            

            const query : QueryFilter<IOrder> = {
                _id: orderId,
                storeId: storeId
            }

            if(role === "cashier") {
                query.cashierId = userId
            }

            const result = await ModelOrder.findOne(query);

            if(!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to find one order");
        } catch(error) {
            return response.error(res, error, "failed to find one order");
        }
    },

    cancelled: async(req: IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");

            const {orderId} = req.params;
            if(!isValidObjectId(orderId)) return response.notFound(res, "order is not found");

            const storeId = req.user?.storeId;
            if(!storeId) return response.notFound(res, "store is not found");

            const role = req.user?.role;
            if(!role) return response.unauthorized(res);

            const query : QueryFilter<IOrder> = {
                _id: orderId,
                status: "paid",
                storeId: storeId
            }

            if(role === "cashier") {
                query.cashierId = userId
            }

            const result = await ModelOrder.findOneAndUpdate(query, {
                status: "cancelled"
            }, {
                new: true
            });

            if(!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to cancel order");
        }catch(error) {
            return response.error(res, error, "failed to cancel order");
        }
    },

    uncancel : async(req: IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");

            const {orderId} = req.params;
            if(!isValidObjectId(orderId)) return response.notFound(res, "order is not found");

            const storeId = req.user?.storeId;
            if(!storeId) return response.notFound(res, "store is not found");

            const query : QueryFilter<IOrder> = {
                _id: orderId,
                status: "cancelled",
                storeId: storeId
            }

            const result = await ModelOrder.findOneAndUpdate(query, {
                status: "paid"
            }, {
                new: true
            });

            if(!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to un cancel order");
        }catch(error) {
            return response.error(res, error, "failed to un cancel order");
        }
    }
} 


export default orderController;