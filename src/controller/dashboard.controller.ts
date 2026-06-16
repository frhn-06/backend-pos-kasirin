import {  Response } from "express";
import { IReqUser } from "../utils/jwt";
import response from "../utils/response";
import { isValidObjectId, ObjectId, Types } from "mongoose";
import ModelOrder from "../model/order.model";
import ModelProduct from "../model/product.model";
import ModelStore from "../model/store.model";
import { match } from "assert";




const dashboardController = {
    OwnerSummary: async(req:IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const store = await ModelStore.findById(storeId);
            if(!store) return response.notFound(res, "store is not found");

            // untuk mengatur batas hari awal mengikuti timezone UTC
            const today = new Date()
            today.setUTCHours(17, 0, 0, 0);
            
            // untuk mengatur batas hari akhir mengikuti timezone UTC
            const tomorrow = new Date();
            tomorrow.setUTCHours(16, 59, 59, 999);
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
          

            console.log(new Date());
            console.log(today);
            console.log(tomorrow)

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

    
    
    
    
    
    OwnertopProducts: async(req:IReqUser, res: Response) => {
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

    
    
    
    
    
    OwnerlastOrders: async(req:IReqUser, res: Response) => {
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













    CashierSummary: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            // untuk mengatur batas hari awal mengikuti timezone UTC
            const today = new Date()
            today.setUTCHours(17, 0, 0, 0);
            today.setUTCDate(today.getUTCDate() - 1);
            
            // untuk mengatur batas hari akhir mengikuti timezone UTC
            const tomorrow = new Date();
            tomorrow.setUTCHours(16, 59, 59, 999);


            const totalPemasukanToday = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        },
                        status: "paid",
                        cashierId: new Types.ObjectId(userId)
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
                        status: "paid",
                        cashierId: new Types.ObjectId(userId)
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
                        status: "paid",
                        cashierId: new Types.ObjectId(userId)
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
            ]);


            const totalPemasukan = totalPemasukanToday[0]?.totalHarga || 0;
            const totalOrder = totalOrderToday[0]?.hasilCount || 0;
            const totalProductKeluar = totalProdukKeluarToday[0]?.totalProduct || 0;

            const result = {
                totalPemasukanToday: totalPemasukan,
                totalOrderToday: totalOrder,
                totalProdukKeluarToday: totalProductKeluar
            }

            response.success(res, result, "success to get summary dashboard")
        }catch(error) {
            response.error(res, error, "failed to get summary dashboard")
        }
    },


    
    CashierLastOrder: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");


            const result = await ModelOrder.find({
                storeId: storeId,
                cashierId: userId,
                status: "paid"
            }).select("_id orderNumber totalAmount paymentMethod createdAt").limit(5).sort({createdAt: -1}).lean().exec();

            response.success(res, result, "success to get cashier last order")
        } catch(error) {
            response.error(res, error, "failed to get cashier last order")   
        }
    },


    CashierPaymentSummary: async(req: IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const today = new Date();
            today.setUTCHours(17, 0, 0, 0);
            today.setUTCDate(today.getUTCDate() - 1);

            const tomorrow = new Date();
            tomorrow.setUTCHours(16, 59, 59, 999)

            const result = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        cashierId: new Types.ObjectId(userId),
                        status: "paid",
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        }
                    }
                },
                {
                    $group: {
                        _id: "$paymentMethod",
                        totalAmount: {
                            $sum: "$totalAmount"
                        }
                    }
                }, 
                {
                    $project: {
                        _id: 0,
                        paymentMethod: "$_id",
                        total: "$totalAmount"
                    }
                }
            ]);


            const totalDaritotal = result.reduce((sum, data) => {
                return sum + data.total;
            },0);

            const resultAkhir = result.map((data) => {
                return {
                    ...data,
                    percentage: totalDaritotal > 0 ? ((data.total / totalDaritotal) * 100).toFixed() : 0
                }
            });


            response.success(res, resultAkhir, "success  to get cashier payment summary");

        } catch(error) {
            response.error(res, error, "failed to get cashier payment summary")
        }
    },


    CashierTopProducts: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found");

            const today = new Date();
            today.setUTCHours(17, 0, 0, 0);
            today.setUTCDate(today.getUTCDate() - 1);

            const tomorrow = new Date();
            tomorrow.setUTCHours(16, 59, 59, 999)

            const result = await ModelOrder.aggregate([
                {
                    $match: {
                        storeId: new Types.ObjectId(storeId),
                        cashierId: new Types.ObjectId(userId),
                        status: "paid",
                        createdAt: {
                            $gte: today,
                            $lte: tomorrow
                        }
                    }
                },
                {
                    $unwind: "$items"
                },
                {
                    $group: {
                        _id: "$items.productName",
                        qtyProduct: {
                            $sum: "$items.qty"
                        },
                        priceProduct: {
                            $first: "$items.price"
                        }
                    }
                },
                {
                    $sort: {
                        qtyProduct: -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                        _id: 0,
                        productName: "$_id",
                        totalSold: "$qtyProduct",
                        price: "$priceProduct"
                    }
                }
            ]);

            response.success(res, result, "success to get cashier top products");

        }catch(error) {
            response.error(res, error, "failed to get cashier top products")
        }
    }
}


export default dashboardController;