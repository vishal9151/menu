import { CategoryModel } from "../models/categorySchema.js";
import { ProductModel } from "../models/productSchema.js";
import CategoryService from "./category.js";

export default class ProductService{

    static async addNewProduct(productData){
        try {
            const newProduct = new ProductModel(productData);
            const newProductData= await newProduct.save();
            return newProductData; 
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async getAllProducts(filters){
        try {
            const products= await ProductModel.find(filters).populate("category");
            return products;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async updateProduct(query, productId) {
        try {
            const product= await ProductModel.findById(productId);
            if(product){
                const categoryId= product.category;
                if(categoryId){
                    if(query.category && categoryId!=query.category){
                        console.log("Inside this category change",categoryId, query.category)
                        const currentCategory= await CategoryModel.findById(query.category);  
                        if(currentCategory){
                            await CategoryService.deleteProductFromCategory(categoryId,productId);
                            currentCategory.products.push(productId);
                            await CategoryService.updateCategory({products: currentCategory.products},query.category);
                            const updatedData= await ProductModel.findByIdAndUpdate(productId,query,{new: true});
                            return updatedData;
                        }
                        else{
                            throw {status: 404, message: "Category not found"};
                        }                     
                    }
                    else{
                        const updatedData= await ProductModel.findByIdAndUpdate(productId,query,{new: true});
                        return updatedData;
                    }
                }
                else{
                    if(query.category){
                        const category= await CategoryModel.findById(query.category);
                        if(category){
                            category.products.push(productId);
                            await CategoryService.updateCategory({products: category.products},query.category);
                            const updatedData= await ProductModel.findByIdAndUpdate(productId,query,{new: true});
                            return updatedData;
                        }
                        else{
                            throw {status: 404, message: "Category not found"};
                        }
                    }
                    else{
                        const updatedData= await ProductModel.findByIdAndUpdate(productId,query,{new: true});
                        return updatedData;
                    }
                }
            }
            else{
                throw {status: 404, message: "Product not found"};
            }
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }
    

    static async deletedProduct(productId){
        try {
            const product= await ProductModel.findById(productId);
            if(product){
                const categoryId= product.category;
                const removedCategory= await CategoryService.deleteProductFromCategory(categoryId,productId);
                if(removedCategory){
                    const removedProduct= await ProductModel.findByIdAndDelete(productId);
                    return removedProduct;
                }
                else{
                    throw {status: 404, message: "Category not found"};
                }
            }
            else{
                throw {status: 404, message: "Product not found"};
            }
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }
}