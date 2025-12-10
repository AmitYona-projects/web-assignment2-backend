import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import {
  createCommentSchema,
  deleteCommentByIdSchema,
  getCommentByIdSchema,
  getCommentsByPostIdSchema,
  updateCommentSchema,
} from "./validator";
import { CommentController } from "./controller";
import { wrapController } from "../../utils/express/middlewares";

const commentRouter = Router();

commentRouter.get("/", wrapController(CommentController.getAllComments));
commentRouter.get(
  "/:id",
  ValidateRequest(getCommentByIdSchema),
  wrapController(CommentController.getCommentById)
);
commentRouter.get(
  "/post/:postId",
  ValidateRequest(getCommentsByPostIdSchema),
  wrapController(CommentController.getCommentsByPostId)
);
commentRouter.post(
  "/",
  ValidateRequest(createCommentSchema),
  wrapController(CommentController.createComment)
);
commentRouter.put(
  "/:id",
  ValidateRequest(updateCommentSchema),
  wrapController(CommentController.updateCommentById)
);
commentRouter.delete(
  "/:id",
  ValidateRequest(deleteCommentByIdSchema),
  wrapController(CommentController.deleteCommentById)
);

export default commentRouter;
