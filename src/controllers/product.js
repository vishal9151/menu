import { ProductModel } from "../models/productSchema.js";
import CategoryService from "../services/category.js";
import ProductService from "../services/product.js";

export default class ProductController {

    async addProduct(req, res) {
        try {
            const userData = req.userData;
            if (!userData) {
                throw { status: 401, message: "Token is expired or invalid" };
            }

            const { category_id, product_name, status, price } = req.body;

            if (!category_id || typeof category_id !== "string") {
                throw { status: 400, message: "Category ID is required and must be a string" };
            }
            if (!product_name || typeof product_name !== "string") {
                throw { status: 400, message: "Product name is required and must be a string" };
            }
            if (typeof status !== "boolean") {
                throw { status: 400, message: "Status is required and must be a boolean" };
            }
            if (!price || typeof price !== "number") {
                throw { status: 400, message: "Product price is required and must be a number" };
            }

            const payload = {
                user_id: userData.user_id,
                category: category_id,
                product_name,
                status,
                price
            };

            const createdProduct = await ProductService.addNewProduct(payload);
            if (createdProduct) {
                const productId = createdProduct?._id;
                const updatedCategory = await CategoryService.addProductToCategory(category_id, productId);

                if (updatedCategory) {
                    return res.status(201).json({ message: "Product created successfully", data: createdProduct });
                } else {
                    // Rollback product creation if category update fails
                    await ProductModel.findByIdAndDelete(productId);
                    throw { status: 500, message: "Error updating category with the new product" };
                }
            } else {
                throw { status: 500, message: "Failed to create product" };
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async getAllProducts(req, res) {
        try {
            const userData = req.userData;
            if (!userData) {
                throw { status: 401, message: "Token is expired or invalid" };
            }
            const allProducts = await ProductService.getAllProducts({user_id: userData.user_id});
            if (allProducts.length > 0) {
                return res.status(200).json({ message: "Products retrieved successfully", data: allProducts });
            } else {
                return res.status(404).json({ message: "No products found" });
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async updateProducts(req,res){
        try {
            const userData = req.userData;
            if (!userData) {
                throw { status: 401, message: "Token is expired or invalid" };
            }
            const {product_name,productId, status, price, category_id}= req.body;
            if(!productId){
                throw { status: 400, message: "Product Id is Mandatory" };
            }
            const query={};
            if(typeof status=="boolean"){
                query.status= status;
            }
            if(typeof product_name=="string"){
                query.product_name= product_name;
            }
            if(typeof price=="number"){
                query.price= price;
            }
            if(typeof category_id=="string"){
                query.category= category_id;
            }
            const updatedProduct= await ProductService.updateProduct(query,productId);
            if(updatedProduct){
                return res.status(200).json({message: "Updated Successfully",data: updatedProduct});
            }
            else{
                throw { status: 404, message: "Product not found" };
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async deleteProduct(req, res) {
        try {
          const { productId } = req.query;
    
          if (!productId) {
            throw { status: 400, message: "Product ID is required" };
          }
    
          const deletedProduct = await ProductService.deletedProduct(productId);
          if (deletedProduct) {
            return res
              .status(200)
              .json({
                message: "Product deleted successfully",
                data: deletedProduct,
              });
          } else {
            throw { status: 404, message: "Product not found" };
          }
        } catch (error) {
          return res
            .status(error.status || 500)
            .json({ message: error.message || "Something went wrong" });
        }
    }

    async getAllProductsPlugin(req,res){
        try {
          const {user_id,category_id}= req.query;
          if(!user_id || !category_id){
            throw { status: 400, message: "Please provide the user id" };
          }
          const filters={
            user_id,
            status: true,
            category: category_id,
          };
    
          const allProducts= await ProductService.getAllProducts(filters);
          if (allProducts.length > 0) {
            return res
              .status(200)
              .json({
                message: "Products retrieved successfully",
                data: allProducts,
              });
          } else {
            return res.status(404).json({ message: "No Products found" });
          }
          
        } catch (error) {
          return res
            .status(error.status || 500)
            .json({ message: error.message || "Something went wrong" });
        }
      }
}
