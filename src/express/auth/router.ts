import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from "./validator";
import { wrapController } from "../../utils/express/middlewares";
import { AuthController } from "./controller";
import { authMiddleware } from "./middleware";

const authRouter = Router();

authRouter.post("/login", ValidateRequest(loginSchema), wrapController(AuthController.login));

authRouter.post("/register", ValidateRequest(registerSchema), wrapController(AuthController.register));

authRouter.post("/logout", authMiddleware, ValidateRequest(logoutSchema), wrapController(AuthController.logout));

authRouter.post(
    "/refresh-token",
    authMiddleware,
    ValidateRequest(refreshTokenSchema),
    wrapController(AuthController.refreshToken)
);

export default authRouter;
