import mongoose, { Model, Types } from 'mongoose';
import * as yup from 'yup';



export const productDTO = yup.object({
    name: yup.string().required(),
    img: yup.string().required(),
    price: yup.number().required(),
    categoryId: yup.string().required()
});

 
export type IProductForm = yup.InferType<typeof productDTO>;

interface IProduct extends Omit<IProductForm, "categoryId"> {
    categoryId: Types.ObjectId;
    storeId: Types.ObjectId;
    isAvailable: boolean;
}

export type {IProduct};

const schema = mongoose.Schema;

const schemaProduct = new schema<IProduct>({
    name: {
        type: schema.Types.String,
        required: true,
    },
    img: {
        type: schema.Types.String,
        required: true
    },
    price: {
        type: schema.Types.Number,
        required: true,
    },
    categoryId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    storeId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Store"
    },
    isAvailable: {
        type: schema.Types.Boolean,
        default: true
    },
},{
    timestamps: true
});

schemaProduct.index({
    "name": "text"
});

schemaProduct.index({categoryId: 1, storeId: 1});

const ModelProduct = mongoose.model("Product", schemaProduct);

export default ModelProduct;
