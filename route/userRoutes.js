import { zodValidationMiddleware } from "../middleware/zodValidationMiddleware";
import { Router } from "express";
import { userSchema } from "../schemas/userSchema";
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userController";
import upload from "../middleware/multerMiddleware.js";
import  authMiddleware from "../middleware/authMiddleware.js";



const userRoutes = Router();


userRoutes.post(
    "/create",
    upload.single("profilePicture"),
    zodValidationMiddleware(userSchema.createUserSchema),
    createUser
);  

userRoutes.get("/:id", authMiddleware, getUser);
userRoutes.put(
    "/:id",
    authMiddleware,
    upload.single("profilePicture"),
    zodValidationMiddleware(userSchema.updateUserSchema),
    updateUser
);
userRoutes.delete("/:id", authMiddleware, deleteUser);

export default userRoutes;
