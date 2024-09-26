import mongoose from "mongoose";
export const userSchema= new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true, // Make the email field required
        unique: true, // Ensure the email is unique across the collection
        lowercase: true, // Convert the email to lowercase before saving
        trim: true, // Remove whitespace around the email
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            "Please fill a valid email address"
        ] // Validate the email format using a regex
    },
    mobile: {
        type: String,
        required: true, // Make the mobile number field required
        unique: true, // Ensure the mobile number is unique across the collection
        trim: true, // Remove whitespace around the mobile number
        match: [
            /^\d{10}$/, 
            "Please fill a valid 10-digit mobile number"
        ] // Validate the mobile number format (10 digits)
    },
    company_name: String,
    password: String
},{
    timestamps: {createdAt: true, updatedAt: true}
})

export const UserModel= mongoose.model("users",userSchema);