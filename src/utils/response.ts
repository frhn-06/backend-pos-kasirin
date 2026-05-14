import { Response } from "express";
import mongoose from "mongoose";
import * as yup from 'yup'

const response = {
    success: (res: Response, data: any, message: string) => {
        return res.status(200).json({
            meta: {
                status: 200,
                message: message
            },
            data: data
        })
    },

    error: (res: Response, error: any, message: string) => {
        if(error instanceof yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    success: false,
                    type: "yup",
                    message: error.message
                },
                data: {
                    [`${error.path}`] : error.errors
                }
            })
        }

        if(error instanceof mongoose.Error) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    success: false,
                    type: "mongoose-error",
                    message: error.message
                },
                data: error.name
            })
        }

        if((error as any).code) {
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: (error as any).errorResponse.errmsg
                },
                data: error as any
            })
        }


        return res.status(500).json({
            meta: {
                status: 500,
                message: message
            },
            data: error
        })
    },

    notFound: (res: Response, message: string) => {
        return res.status(404).json({
            meta: {
                status: 404,
                message: message
            }
        })
    },

    unauthorized: (res:Response) => {
        return res.status(403).json({
            meta: {
                status: 403,
                message: "unauthorized"
            }
        })
    }
}


export default response;