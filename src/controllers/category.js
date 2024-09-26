import CategoryService from "../services/category.js";

export default class CategoryController {
  async addNewCategory(req, res) {
    try {
      const userData = req.userData;
      if (!userData) {
        throw { status: 401, message: "Token is expired or invalid" };
      }

      const { category_name, status } = req.body;

      if (!category_name || typeof category_name !== "string") {
        throw {
          status: 400,
          message: "Category name is required and must be a string",
        };
      }
      if (typeof status !== "boolean") {
        throw {
          status: 400,
          message: "Status is required and must be a boolean",
        };
      }

      const categoryPayload = {
        user_id: userData.user_id,
        category_name,
        status,
        products: [],
      };

      const newCategory = await CategoryService.addCategory(categoryPayload);
      if (newCategory) {
        return res
          .status(201)
          .json({
            message: "Category Created Successfully",
            data: newCategory,
          });
      } else {
        throw { status: 500, message: "Failed to create category" };
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async getAllCategories(req, res) {
    try {
      const {category_name, status}= req.query;
      const user_data= req.userData;
      const filters={};
      if(user_data){
        const userId= user_data.user_id;
        if(userId){
          filters.user_id= userId;
        }
      }
      if(typeof category_name=="string"){
        filters.category_name= {$regex: category_name, $options: "i"}
      }  
      if(status != undefined){
        filters.status= status=="true"
      }
      const allCategories = await CategoryService.getAllCategory(filters);
      if (allCategories.length > 0) {
        return res
          .status(200)
          .json({
            message: "Categories retrieved successfully",
            data: allCategories,
          });
      } else {
        return res.status(404).json({ message: "No categories found" });
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async updateCategory(req, res) {
    try {
      const { category_id, category_name, status } = req.body;

      if (!category_id) {
        throw { status: 400, message: "Category ID is required" };
      }

      const query = {};
      if (category_name) {
        if (typeof category_name !== "string") {
          throw { status: 400, message: "Category name must be a string" };
        }
        query.category_name = category_name;
      }
      if (status !== undefined) {
        if (typeof status !== "boolean") {
          throw { status: 400, message: "Status must be a boolean" };
        }
        query.status = status;
      }

      const updatedCategory = await CategoryService.updateCategory(
        query,
        category_id
      );
      if (updatedCategory) {
        return res
          .status(200)
          .json({
            message: "Category updated successfully",
            data: updatedCategory,
          });
      } else {
        throw { status: 404, message: "Category not found" };
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { category_id } = req.query;

      if (!category_id) {
        throw { status: 400, message: "Category ID is required" };
      }

      const deletedCategory = await CategoryService.deleteCategory(category_id);
      if (deletedCategory) {
        return res
          .status(200)
          .json({
            message: "Category deleted successfully",
            data: deletedCategory,
          });
      } else {
        throw { status: 404, message: "Category not found" };
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async getAllCategoriesPlugin(req,res){
    try {
      const {user_id}= req.query;
      if(!user_id){
        throw { status: 400, message: "Please provide the user id" };
      }
      const filters={
        user_id,
        status: true
      };

      const allCategories= await CategoryService.getAllCategory(filters);
      if (allCategories.length > 0) {
        return res
          .status(200)
          .json({
            message: "Categories retrieved successfully",
            data: allCategories,
          });
      } else {
        return res.status(404).json({ message: "No categories found" });
      }
      
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }
}
