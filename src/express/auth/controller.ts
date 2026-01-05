import { Request, Response } from "express";
import { CommentManager } from "./manager";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        res.json(await AuthManager.login(req.body));
    };

    static register = async (req: Request, res: Response) => {
        res.json(await AuthManager.register(req.body));
    };

    static logout = async (req: Request, res: Response) => {
        res.json(await AuthManager.logout(req.body));
    };

    static refreshToken = async (req: Request, res: Response) => {
        res.json(await AuthManager.refreshToken(req.body));
    };
}
