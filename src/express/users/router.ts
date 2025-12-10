import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import { createUserSchema, deleteUserByIdSchema, getUserByIdSchema, updateUserSchema } from "./validator";
import { UserController } from "./controller";
import { wrapController } from "../../utils/express/middlewares";

const userRouter = Router();

userRouter.get("/", wrapController(UserController.getAllUsers));
userRouter.get("/:id", ValidateRequest(getUserByIdSchema), wrapController(UserController.getUserById));
userRouter.post("/", ValidateRequest(createUserSchema), wrapController(UserController.createUser));
userRouter.put("/:id", ValidateRequest(updateUserSchema), wrapController(UserController.updateUser));
userRouter.delete("/:id", ValidateRequest(deleteUserByIdSchema), wrapController(UserController.deleteUserById));

export default userRouter;
