import mongoose, { Types } from 'mongoose';
import { EnumType } from 'typescript';
import * as yup from 'yup';

export const orderDTO = yup.object({
    items: yup.array().of(
        yup.object({
            productId: yup.string().required(),
            qty: yup.number().required().min(1)
        })
    ).required().min(1),

    paymentMethod: yup.string().oneOf(["cash", "qris", "transfer"]).required(),

    paidAmount: yup.number().required()
});

export const EnumStatus = {
    paid : "paid",
    cancelled: "cancelled"
} as const

export const EnumPayment = {
    cash: "cash",
    qris: "qris",
    transfer: "transfer"
} as const

export type IOrderForm = yup.InferType<typeof orderDTO>;

interface IOrder extends Omit<IOrderForm, "items" | "paymentMethod"> {
    items: {
        productId: Types.ObjectId;
        productName: string;
        price: number;
        qty: number;
        subTotal: number;
    }[];
    paymentMethod: "cash" | "qris" | "transfer";
    totalAmount: number;
    changeAmount: number;
    cashierId: Types.ObjectId;
    storeId: Types.ObjectId;
    orderNumber: string;
    status: "paid" | "cancelled";
}

const schema = mongoose.Schema;

const orderSchema = new schema<IOrder>({
    items: [{
        productId: {
            type: schema.Types.ObjectId,
            required: true
        },
        productName: {
            type: schema.Types.String,
            required: true
        },
        price: {
            type: schema.Types.Number,
            required: true
        },
        qty: {
            type: schema.Types.Number,
            required: true
        },
        subTotal: {
            type: schema.Types.Number,
            required: true
        }
    }],
    paymentMethod: {
        type: schema.Types.String,
        enum: [EnumPayment.cash, EnumPayment.qris, EnumPayment.transfer],
        required: true
    },
    paidAmount: {
        type: schema.Types.Number,
        required: true
    },
    totalAmount: {
        type: schema.Types.Number,
        required: true
    },
    changeAmount: {
        type: schema.Types.Number,
        required: true
    },
    cashierId: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    storeId: {
        type: schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    orderNumber: {
        type: schema.Types.String,
        required: true
    },
    status: {
        type: schema.Types.String,
        enum: [EnumStatus.paid, EnumStatus.cancelled],
        required: true
    }
}, {
    timestamps: true
});


orderSchema.index({storeId: 1});

orderSchema.index({
    storeId: 1,
    createdAt: -1
})

orderSchema.index({
    orderNumber: 1
}, {
    unique: true
})

orderSchema.index({
    cashierId: 1,
    createdAt: -1
});

const ModelOrder = mongoose.model("Order", orderSchema);

export type {IOrder}

export default ModelOrder;