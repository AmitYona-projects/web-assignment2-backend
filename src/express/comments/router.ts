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

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the comment
 *         commentText:
 *           type: string
 *           description: Content of the comment
 *         postId:
 *           type: string
 *           description: ID of the post
 *         senderId:
 *           type: string
 *           description: ID of the sender
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the comment was last updated
 *
 *     CreateComment:
 *       type: object
 *       required:
 *         - commentText
 *         - postId
 *         - senderId
 *       properties:
 *         commentText:
 *           type: string
 *           description: Content of the comment
 *           example: "This is a test comment"
 *         postId:
 *           type: string
 *           description: ID of the post
 *           example: "67a1d205c689f9a4e5476a1a"
 *         senderId:
 *           type: string
 *           description: ID of the sender
 *           example: "67a1d205c689f9a4e5476a1b"
 *
 *     UpdateComment:
 *       type: object
 *       properties:
 *         commentText:
 *           type: string
 *           description: Content of the comment
 *           example: "This is a test comment"
 *         postId:
 *           type: string
 *           description: ID of the post
 *           example: "67a1d205c689f9a4e5456a1a"
 *         senderId:
 *           type: string
 *           description: ID of the sender
 *           example: "67a1d205c689f9a4e5476a1c"
 *     InternalServerError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Internal server error"
 *
 *     BadRequestError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Invalid request body"
 *
 *     InvalidIdError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Invalid comment ID"
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Comment not found"
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       '200':
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
commentRouter.get("/", wrapController(CommentController.getAllComments));

/**
 * @swagger
 * /comments/:id:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment
 *         example: "67a1d205c689f9a4e5476a1b"
 *     responses:
 *       '200':
 *         description: A comment by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidIdError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
commentRouter.get("/:id", ValidateRequest(getCommentByIdSchema), wrapController(CommentController.getCommentById));

/**
 * @swagger
 * /comments/post/:postId:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         example: "67a1d205c689f9a4e5476a1a"
 *     responses:
 *       '200':
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid post ID"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 */
commentRouter.get(
    "/post/:postId",
    ValidateRequest(getCommentsByPostIdSchema),
    wrapController(CommentController.getCommentsByPostId)
);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComment'
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
commentRouter.post("/", ValidateRequest(createCommentSchema), wrapController(CommentController.createComment));

/**
 * @swagger
 * /comments/:id:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment
 *         example: "67a1d205c689f9a4e5476a1b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
commentRouter.put("/:id", ValidateRequest(updateCommentSchema), wrapController(CommentController.updateCommentById));

/**
 * @swagger
 * /comments/:id:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment
 *         example: "67a1d205c689f9a4e5476a1b"
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Comment <id> deleted successfully"
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidIdError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
commentRouter.delete(
    "/:id",
    ValidateRequest(deleteCommentByIdSchema),
    wrapController(CommentController.deleteCommentById)
);

export default commentRouter;
