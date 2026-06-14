import {  Response } from "express";
import { IReqUser } from "../utils/jwt";
import response from "../utils/response";
import { isValidObjectId, ObjectId, Types } from "mongoose";
import ModelOrder from "../model/order.model";
import ModelProduct from "../model/product.model";




const dashboardController = {
    summary: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");


            const today = new Date();
            const tomorrow = new Date();

            today.setHours(0, 0, 0, 0);
            tomorrow.setHours(23, 59, 59, 999);

            console.log(
    Intl.DateTimeFormat().resolvedOptions().timeZone
);

            const totalPemasukanToday = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        },
                        status: "paid"
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalHarga: {
                            $sum: "$totalAmount" 
                        },
                    }
                }
            ]);


            const totalOrderToday = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        },
                        status: "paid"
                    }
                }, 
                {
                    $count : "hasilCount"  
                }
            ]);

            const totalProdukKeluarToday = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        },
                        status: "paid"
                    }
                },
                {
                    $unwind : "$items"
                },
                {
                    $group: {
                        _id: null,
                        totalProduct: {
                            $sum: "$items.qty"
                        }
                    }
                }
            ])

            const totalPemasukan = totalPemasukanToday[0]?.totalHarga || 0;
            const totalOrder = totalOrderToday[0]?.hasilCount || 0;
            const totalProduk = totalProdukKeluarToday[0]?.totalProduct || 0;
            
            const payload = {
                totalPemasukanToday: totalPemasukan,
                totalOrderToday: totalOrder,
                totalProdukKeluarToday: totalProduk,
                rataRataPemasukanToday: totalOrder > 0? totalPemasukan / totalOrder : 0
            }

            response.success(res, payload, "success to get summary dashboard")
        }catch(error) {
            response.error(res, error, "failed to get summary dashboard")
        }
    },

    
    
    
    
    
    salesTrend: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const semingguYgLalu = new Date();
            semingguYgLalu.setDate(semingguYgLalu.getDate() - 7);

            const result = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        status: "paid",
                        createdAt: {
                            $gte: semingguYgLalu
                        }
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                date: "$createdAt",
                                format: "%Y-%m-%d",
                                timezone: "Asia/Jakarta"
                            }
                        },
                        totalSales: {
                            $sum: "$totalAmount"
                        },
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSales: 1,
                        date: "$_id"
                    }
                }
            ]);

            response.success(res, result, "success to get sales trend")
            
        }catch(error) {
            response.error(res, error, "failed to get sales trend")
        }
    },

    
    
    
    
    
    topProducts: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const result = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        status: "paid",        
                    },
                },
                {
                    $unwind: "$items"
                },
                {
                    $group: {
                        _id: "$items.productName",
                        totalQty: {
                            $sum: "$items.qty" 
                        },
                        priceProduct: {
                            $first: "$items.price"
                        }
                    }
                },
                {
                    $sort: {
                        totalQty: -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                        _id: 0,
                        productName: "$_id",
                        totalSold: "$totalQty",
                        price: "$priceProduct"
                    }
                }
            ])

            response.success(res, result, "success to get top products");
        }catch(error) {
            response.error(res, error, "failed to get top products")
        }
    },

    
    
    
    
    
    lastOrders: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const result = await ModelOrder.find({
                storeId: new Types.ObjectId(storeId),
                status: "paid"
            }).select("orderNumber totalAmount paymentMethod cashierSnapshot createdAt").limit(5).sort({
                createdAt: -1
            }).exec();

            response.success(res, result, "success to find last orders")

        }catch(error) {
            response.error(res, error, "failed to find last orders")
        }
    },


}


export default dashboardController;