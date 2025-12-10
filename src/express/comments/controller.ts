import { Request, Response } from "express";
import { CommentManager } from "./manager";

export class CommentController {
  static getAllComments = async (_req: Request, res: Response) => {
    res.json(await CommentManager.getAllComments());
  };

  static getCommentById = async (req: Request, res: Response) => {
    res.json(await CommentManager.getCommentById(req.params.id));
  };

  static getCommentsByPostId = async (req: Request, res: Response) => {
    res.json(
      await CommentManager.getCommentsByPostId(req.params.postId as string)
    );
  };

  static createComment = async (req: Request, res: Response) => {
    res.json(await CommentManager.createComment(req.body));
  };

  static updateCommentById = async (req: Request, res: Response) => {
    res.json(await CommentManager.updateCommentById(req.params.id, req.body));
  };

  static deleteCommentById = async (req: Request, res: Response) => {
    res.json(await CommentManager.deleteCommentById(req.params.id));
  };
}
