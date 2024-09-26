import { CategoryModel } from "../models/categorySchema.js";
import { ProductModel } from "../models/productSchema.js";
export default class CategoryService{
    static async addCategory(category){
        try {
            const newCategory = new CategoryModel(category);
            const categoryData= await newCategory.save();
            return categoryData; 
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async getAllCategory(filters){
        try {
            const categories= await CategoryModel.find(filters).populate("products");
            return categories;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async updateCategory(query, categoryId){
        try {
            const updatedData= await CategoryModel.findByIdAndUpdate(categoryId,query,{new: true});
            return updatedData;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async deleteCategory(categoryId){
        try {
            const deletedData= await CategoryModel.findByIdAndDelete(categoryId);
            await ProductModel.updateMany({category: categoryId},{$set : {category: null}});
            return deletedData;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async addProductToCategory(categoryId, productId){
        try {
            const currentCategory= await CategoryModel.findById(categoryId);
            if(currentCategory){
                console.log("current category",currentCategory);
                currentCategory.products.push(productId);
                const updatedCategory= await this.updateCategory({products: currentCategory.products},categoryId);
                return updatedCategory;
            }
            else{
                throw {status: 400,message: "Category not found"}
            }
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async deleteProductFromCategory(categoryId,productId){
        try {
            const currentCategory= await CategoryModel.findById(categoryId);
            if(currentCategory){
                const newProducts= currentCategory.products.filter((product_id)=>productId!=product_id);
                const updatedCategory= await this.updateCategory({products: newProducts},categoryId);
                return updatedCategory;
            }
            else{
                throw {status: 400,message: "Category not found"}
            }
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }
 }