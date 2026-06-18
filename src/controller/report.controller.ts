import { Response } from "express";
import { IReqUser } from "../utils/jwt";
import response from "../utils/response";
import { isValidObjectId, Types } from "mongoose";
import ModelOrder from "../model/order.model";
import { rangeWIBUTC, todayRangeWIB } from "../utils/todayrangewib";

const reportController = {
    sales: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found"); 

            const {start, end} = req.query as {start: string; end: string};

            const startDateWIB = start ? rangeWIBUTC.start(start) : "";

            const endDateWIB = end ? rangeWIBUTC.end(end) : "";

            const createdAtFilter : any = {}

            if(startDateWIB !== "") createdAtFilter.$gte = startDateWIB;

            if(endDateWIB !== "") createdAtFilter.$lte = endDateWIB;


            const matchFilter: any = {
                storeId: new Types.ObjectId(storeId),
                status: "paid"
            }

            if(Object.keys(createdAtFilter).length > 0) {
                matchFilter.createdAt = createdAtFilter;
            }

            const totalSales = await ModelOrder.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);

            const totalOrders = await ModelOrder.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $count: "totalOrders"
                }
            ]);

            const averegeOrderValue = await ModelOrder.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $group : {
                        _id: null,
                        averegeOrderValue: {
                            $avg: "$totalAmount"
                        }
                    }
                }
            ])

            const salesByDay = await ModelOrder.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $group: {
                        _id: {
                            $dateToString : {
                                date: "$createdAt",
                                format: "%Y-%m-%d",
                                timezone: "Asia/Jakarta"
                            }
                        },
                        totalSales: {
                            $sum: "$totalAmount"
                        },
                        totalOrders: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        totalSales: "$totalSales",
                        totalOrders: "$totalOrders"   
                    }
                }
            ]);

            const result = {
                summary: {
                    totalSales: totalSales[0]?.totalSales,
                    totalOrders: totalOrders[0]?.totalOrders,
                    averegeOrderValue: averegeOrderValue[0]?.averegeOrderValue
                },
                salesByDay: salesByDay? salesByDay : []
            }
             
            response.success(res, result, "success to get report sales");
        } catch(error) {
            response.error(res, error, "failed to get sales report")
        }
    },













    product: async(req: IReqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const storeId = req.user?.storeId;
            if(!userId || !isValidObjectId(userId)) return response.notFound(res, "user is not found");
            if(!storeId || !isValidObjectId(storeId)) return response.notFound(res, "store is not found"); 

            const {start, end} = req.query as {start: string; end: string}

            const startDate = start ? rangeWIBUTC.start(start) : "";
            const endDate = end ? rangeWIBUTC.end(end) : "";

            const createdAtMatch: any = {}

            if(startDate) {
                createdAtMatch.$gte = startDate;
            }

            if(endDate) {
                createdAtMatch.$lte = endDate;
            }

            const matchFilter:any = {
                status: "paid",
                storeId: new Types.ObjectId(storeId)
            }

            if(Object.keys(createdAtMatch).length > 0) {
                matchFilter.createdAt = createdAtMatch
            }

            


            const result = await ModelOrder.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $unwind: "$items"
                },
                {
                    $group: {
                        _id: "$items.productId",
                        productName: {
                            $first: "$items.productName"
                        },
                        totalQty: {
                            $sum: "$items.qty"
                        },
                        totalPemasukan: {
                            $sum: "$items.subTotal"
                        },
                        orderIds: {
                            $addToSet: "$_id"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productId: "$_id",
                        productName: "$productName",
                        qtySold: "$totalQty",
                        totalPemasukan: "$totalPemasukan",
                        totalOrders: {
                            $size: "$orderIds"
                        },
                    }
                },
                {
                    $sort: {
                        totalPemasukan: -1
                    }
                }
            ]);

            const final = result || [];

            response.success(res, final, "success to get product report");


        } catch(error) {
            response.error(res, error, "failed to get product report")
        }
    }
}

export default reportController;