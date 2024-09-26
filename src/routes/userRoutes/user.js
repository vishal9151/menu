import express from "express";
import UserController from "../../controllers/user.js";

const router= express.Router();
const userController= new UserController();

router.post("/register", userController.signUp);
router.post("/login",userController.signIn);
router.get("/valid-email",userController.findEmail);
router.post("/password/reset",userController.resetPassword);
router.get("/plugin",userController.getUserDetails);

export const userRouter = router;