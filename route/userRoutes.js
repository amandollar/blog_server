import { zodValidationMiddleware } from "../middleware/zodValidationMiddleware.js";
import { Router } from "express";
import {userZodSchema} from "../schemas/userSchema.js";
import { registerUser,  loginUser, getUserProfile, deleteUser,getAllUsers ,getUserById } from "../controller/User.js";
import authMiddleware from "../middleware/authMiddleware.js";



const userRouter = Router();

userRouter.post("/register", zodValidationMiddleware(userZodSchema), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.delete("/delete", authMiddleware, deleteUser);
userRouter.get("/", authMiddleware, getAllUsers);
userRouter.get("/:id", authMiddleware, getUserById);

export default userRouter;
