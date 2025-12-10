import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import { createPostSchema, deletePostByIdSchema, getPostByIdSchema, getPostsBySenderIdSchema, updatePostSchema } from "./validator";
import { PostController } from "./controller";
import { wrapController } from "../../utils/express/middlewares";


const postRouter = Router();

postRouter.get("/", wrapController(PostController.getAllPosts));
postRouter.get("/sender", ValidateRequest(getPostsBySenderIdSchema), wrapController(PostController.getPostsBySenderId));
postRouter.get("/:id", ValidateRequest(getPostByIdSchema), wrapController(PostController.getPostById));
postRouter.post("/", ValidateRequest(createPostSchema), wrapController(PostController.createPost));
postRouter.put("/:id", ValidateRequest(updatePostSchema), wrapController(PostController.updatePost));
postRouter.delete("/:id", ValidateRequest(deletePostByIdSchema), wrapController(PostController.deletePostById));

export default postRouter;