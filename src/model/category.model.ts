import mongoose, { Model, Types } from 'mongoose';
import * as yup from 'yup';



export const categoryDTO = yup.object({
    name: yup.string().required(),
    img: yup.string().required(),
});

 
export type ICategoryForm = yup.InferType<typeof categoryDTO>;

interface ICategory extends ICategoryForm {
    slug: string;
    storeId: Types.ObjectId;
}

export type {ICategory};

const schema = mongoose.Schema;

const schemaCategory = new schema<ICategory>({
    name: {
        type: schema.Types.String,
        required: true,
    },
    slug: {
        type: schema.Types.String,
    },
    img: {
        type: schema.Types.String,
        required: true,
    },
    storeId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Store"
    }
},{
    timestamps: true
});


schemaCategory.pre("save", async function() {
    if(!this.isModified("name")) return;

    const name = this.name;

    const thisModel = this.constructor as Model<any>

    const baseSlug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

    let slug = baseSlug;

    let counter = 1;

    while (await thisModel.findOne({ slug, storeId: this.storeId })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    this.slug = slug;
})



schemaCategory.index({slug: 1, storeId: 1}, {unique: true});

const ModelCategory = mongoose.model("Category", schemaCategory);

export default ModelCategory;
