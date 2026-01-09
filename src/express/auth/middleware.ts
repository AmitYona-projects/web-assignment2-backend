import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { AuthRequest, ITokenInfo } from "./interface";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(config.auth.bearerPrefix)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication token is required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret) as ITokenInfo;
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token has expired" });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid authentication token" });
    }
};
