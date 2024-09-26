import dotenv from "dotenv";
import express from "express"
import cors from "cors"
dotenv.config();
import connectToMongoDB from "./src/configs/mogodb.js";
import { userRouter } from "./src/routes/userRoutes/user.js";
import { categoryRouter } from "./src/routes/categoryRoutes/category.js";
import { productRouter } from "./src/routes/productRoutes/product.js";

const app= express();

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3001'], // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    credentials: true // If you need to include cookies or authorization headers
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use("/user",userRouter);
app.use("/category",categoryRouter);
app.use("/product",productRouter);

app.listen(process.env.PORT,(err)=>{
    console.log("connect to server", process.env.PORT);
    connectToMongoDB();
})