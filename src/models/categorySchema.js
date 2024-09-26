import mongoose from "mongoose";
const categorySchema= new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    category_name: {type: String, required: true},
    status: {type: Boolean, default: true},
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }] 
},{
    timestamps: {createdAt: true, updatedAt: true}
})

categorySchema.index({ user_id: 1, category_name: 1 }, { unique: true });

export const CategoryModel= mongoose.model("categories",categorySchema);