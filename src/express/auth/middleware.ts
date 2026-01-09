import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { ITokenInfo } from "./interface";

export type AuthRequest = Request & {
    user?: ITokenInfo;
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(config.auth.bearerPrefix)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication token is required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret) as ITokenInfo;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token has expired" });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid authentication token" });
    }
};
