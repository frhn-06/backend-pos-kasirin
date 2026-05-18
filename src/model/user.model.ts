import mongoose, { Types } from 'mongoose';
import * as yup from 'yup';
import encrypt from '../utils/encrypt';
import { truncateSync } from 'fs';
import { renderHtml, sendMail } from '../utils/nodemailer/mail';
import { CLIENT_HOST, MAIL_ME } from '../utils/env';


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

export const LoginDTO = yup.object({
    identifier: yup.string().required(),
    password: passwordYup,
});
 
export type IRegisterForm = yup.InferType<typeof UserDTO>;

interface IUser extends Omit<IRegisterForm, "confirmPassword"> {
    activationCode: string;
    avatar: string | null;
    isActive: boolean;
    storeId: Types.ObjectId | null;
    role: "owner" | "cashier";
    createdAt: string;
    updatedAt: string;
}

export type {IUser};

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
        enum: ["owner", "cashier"],
        default: "owner"
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



schemaUser.post("save", async function(doc, next) {
    try {
        const user = doc;

        const contentHtml = await renderHtml("activationMail.ejs", {
            title: "pos cafe",
            userName: user.userName,
            fullName: user.fullName,
            email: `${user.email}`,
            tanggal: user.createdAt,
            link: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
        })

        await sendMail({
            from: MAIL_ME,
            to: user.email,
            subject: "Aktivasi Akun",
            html: contentHtml
        })
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
})

schemaUser.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user
}


const ModelUser = mongoose.model("User", schemaUser);

export default ModelUser;
