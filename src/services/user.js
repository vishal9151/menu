import { UserModel } from "../models/userSchema.js";

export default class UserService{

    static async addUser(user){
        try {
            const newUser = new UserModel(user);
            const userData= await newUser.save();
            return userData; 
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async findUser(email){
        try {
            const user= UserModel.findOne({email});
            return user;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }
    
    static async findUserPlugin(user_id){
        try {
            const user= UserModel.findById(user_id);
            return user;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }

    static async updatePassword(id,newPassword){
        try {
            const updatedUser= UserModel.findByIdAndUpdate(id,{password: newPassword},{new: true});
            return updatedUser;
        } catch (error) {
            throw {status: error.status|| 500, message : error.message||"Something Went Wrong"};
        }
    }
}