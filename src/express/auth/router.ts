import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import { loginSchema, registerSchema } from "./validator";
import { wrapController } from "../../utils/express/middlewares";
import { AuthController } from "./controller";

const authRouter = Router();

authRouter.post("/login", ValidateRequest(loginSchema), wrapController(AuthController.login));

authRouter.post("/register", ValidateRequest(registerSchema), wrapController(AuthController.register));

authRouter.post("/logout", wrapController(AuthController.logout));

authRouter.post("/refresh-token", wrapController(AuthController.refreshToken));

export default authRouter;