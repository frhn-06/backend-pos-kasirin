import mongoose, { Model, Types } from 'mongoose';
import * as yup from 'yup';



export const storeDTO = yup.object({
    name: yup.string().required(),
    address: yup.string().required(),
    phone: yup.string().required(),
    description: yup.string(),
    timeZone: yup.string()
});

 
export type IStoreForm = yup.InferType<typeof storeDTO>;

interface IStore extends IStoreForm {
    slug: string;
    ownerId: Types.ObjectId;
    logo: string;
}

export type {IStore};

const schema = mongoose.Schema;

const schemaStore = new schema<IStore>({
    name: {
        type: schema.Types.String,
        required: true,
        trim: true
    },
    slug: {
        type: schema.Types.String,
        unique: true
    },
    logo: {
        type: schema.Types.String,
        default: ""
    },
    address: {
        type: schema.Types.String,
        required: true
    },
    phone: {
        type: schema.Types.String,
        required: true
    },
    description: {
        type: schema.Types.String,
        default: ""
    },
    timeZone: {
        type: schema.Types.String,
        default: "Asia/Jakarta"
    },
    ownerId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
});


schemaStore.pre("save", async function() {
    if(!this.isModified("name")) return;

    const name = this.name;

    const thisModel = this.constructor as Model<any>

    const baseSlug = name.toLowerCase().trim().replace(/[^\w\-]+/g, " ").split(" ").join("-");

    let slug = baseSlug;

    let counter = 1;

    while (await thisModel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    this.slug = slug;
})



const ModelStore = mongoose.model("Store", schemaStore);

export default ModelStore;
