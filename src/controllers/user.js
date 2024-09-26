import UserService from "../services/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class UserController {
    
    async signUp(req, res) {
        try {
            const { name, email, password, company_name, mobile } = req.body;
            
            if (!name || !email || !password || !company_name || !mobile) {
                throw { status: 400, message: "Please provide all required fields" };
            }

            const existingUser = await UserService.findUser(email);
            if (existingUser) {
                throw { status: 409, message: "Email is already registered" }; // 409 for conflict
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const user = { name, email, password: hashPassword, company_name, mobile };
            const newUser = await UserService.addUser(user);

            if (newUser) {
                return res.status(201).json({ message: "User created successfully", data: newUser });
            } else {
                throw { status: 500, message: "Error in creating user" };
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                throw { status: 400, message: "Email and password are required" };
            }

            const user = await UserService.findUser(email);
            if (!user) {
                throw { status: 404, message: "User not found" }; // 404 for not found
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                const userData = {
                    user_id: user._id,
                    name: user.name,
                    email: user.email,
                    company_name: user.company_name,
                };
                const token = jwt.sign(userData, process.env.JWT_PRIVATE, { expiresIn: '2h' }); // Token with 1 hour expiry
                const newUserData = { ...userData, token };

                return res.status(200).json({ message: "User signed in successfully", data: newUserData });
            } else {
                throw { status: 401, message: "Incorrect password" }; // 401 for unauthorized
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async findEmail(req, res) {
        try {
            const { email } = req.query;

            if (!email) {
                throw { status: 400, message: "Email is required" };
            }

            const user = await UserService.findUser(email);
            if (user) {
                return res.status(200).json({ message: "User found successfully", data: user });
            } else {
                throw { status: 404, message: "User not found" };
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async resetPassword(req, res) {
        try {
            const { user_id, changed_password, email } = req.body;

            if (!user_id || !changed_password || !email) {
                throw { status: 400, message: "All fields (user_id, changed_password, email) are required" };
            }

            const userData = await UserService.findUser(email);
            if (!userData) {
                throw { status: 404, message: "User not found" }; // 404 for not found
            }

            const isPreviousPassword = await bcrypt.compare(changed_password, userData.password);
            if (isPreviousPassword) {
                throw { status: 400, message: "New password cannot be the same as the previous password" };
            }

            const newHashedPassword = await bcrypt.hash(changed_password, 10);
            const updatedUser = await UserService.updatePassword(user_id, newHashedPassword);

            if (updatedUser) {
                return res.status(200).json({ message: "Password reset successfully", data: updatedUser });
            } else {
                throw { status: 500, message: "Failed to reset password" };
            }
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }

    async getUserDetails(req,res) {
        try {

            const {user_id} = req.query;

            if(!user_id){
                throw { status: 400, message: "Please provide the user id" };
            }

            const existingUser = await UserService.findUserPlugin(user_id);
            if (existingUser) {
                return res.status(200).json({ message: "User found successfully", data: existingUser });
            } else {
                throw { status: 404, message: "User not found" };
            }  
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
        }
    }
}
