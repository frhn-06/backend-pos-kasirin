import mongoose, { Types } from 'mongoose';
import * as yup from 'yup';
import encrypt from '../utils/encrypt';
import { truncateSync } from 'fs';


const passwordYup = yup.string().min(3, "minimal 3 caracter").test("angka" , "password harus mengandung angka", (value) => {
        if(!value) return false;
        const lolos = /^(?=.*\d)/.test(value || "");
        return lolos;
    }).test("kapital", "password harus mengandung huruf kapital", (value) => {
        if(!value) return false;
        const lolos = /^(?=.*[A-Z])/.test(value || "");
        return lolos
    }).required()
 
const confirmPassowrdYup = yup.string().oneOf([yup.ref("password")], "konfirmasi password tidak sama").required()


export const UserDTO = yup.object({
    userName: yup.string().required(),
    fullName: yup.string().required(),
    email: yup.string().required(),
    password: passwordYup,
    confirmPassword: confirmPassowrdYup
});
 
export type IRegisterForm = yup.InferType<typeof UserDTO>;

interface IUser extends Omit<IRegisterForm, "confirmPassword"> {
    activationCode: string;
    avatar: string | null;
    isActive: boolean;
    storeId: Types.ObjectId | null;
    role: "admin" | "casher"
}

const schema = mongoose.Schema;

const schemaUser = new schema<IUser>({
    userName: {
        type: schema.Types.String,
        required: true,
        unique: true
    },
    fullName: {
        type: schema.Types.String,
        required: true
    },
    email: {
        type: schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: schema.Types.String,
        required: true
    },
    activationCode: {
        type: schema.Types.String,
    },
    isActive: {
        type: schema.Types.Boolean,
        default: false
    },
    avatar: {
        type: schema.Types.String,
        default: null
    },
    role: {
        type: schema.Types.String,
        enum: ["admin", "casher"]
    },
    storeId: {
        type: schema.Types.ObjectId,
        default: null,
        ref: "Store"
    }
},{
    timestamps: true
});



schemaUser.pre("save", async function() {
    if(this.isModified("password")) {
        this.password = encrypt(this.password);
    }
    if(this.isNew) {
        this.activationCode = encrypt(`${this._id}`)
    }
})



const ModelUser = mongoose.model("User", schemaUser);

export default ModelUser;
