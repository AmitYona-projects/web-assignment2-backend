import { Request, Response } from "express";
import { UserManager } from "./manager";

export class UserController {
    static getAllUsers = async (_req: Request, res: Response) => {
        res.json(await UserManager.getAllUsers());
    };

    static getUserById = async (req: Request, res: Response) => {
        res.json(await UserManager.getUserById(req.params.id));
    };

    static createUser = async (req: Request, res: Response) => {
        res.json(await UserManager.createUser(req.body));
    };

    static updateUser = async (req: Request, res: Response) => {
        res.json(await UserManager.updateUserById(req.params.id, req.body));
    };

    static deleteUserById = async (req: Request, res: Response) => {
        res.json(await UserManager.deleteUserById(req.params.id));
    };
}
