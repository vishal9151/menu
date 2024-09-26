import mongoose from "mongoose";
const productSchema= new mongoose.Schema({
    product_name: {type: String, required: true},
    status: {type: Boolean, default: true},
    category: {type: mongoose.Schema.Types.ObjectId,ref: "categories"},
    user_id: {type: mongoose.Schema.Types.ObjectId,ref: "users"},
    price: { type: Number, required: true, default: 0 }
},{
    timestamps: {createdAt: true, updatedAt: true}
})

export const ProductModel= mongoose.model("products",productSchema);