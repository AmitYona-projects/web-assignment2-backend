import express from "express";
import postsRouter from "./posts/router";
import commentsRouter from "./comments/router";

const appRouter = express.Router();

appRouter.use("/posts", postsRouter);
appRouter.use("/comments", commentsRouter);

export default appRouter;
