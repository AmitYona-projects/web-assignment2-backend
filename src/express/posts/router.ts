import { Router } from "express";
import ValidateRequest from "../../utils/express/joi";
import {
    createPostSchema,
    deletePostByIdSchema,
    getPostByIdSchema,
    getPostsBySenderIdSchema,
    updatePostSchema,
} from "./validator";
import { PostController } from "./controller";
import { wrapController } from "../../utils/express/middlewares";

const postRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the post
 *         description:
 *           type: string
 *           description: Description of the post
 *         senderId:
 *           type: string
 *           description: User ID of the sender
 *         title:
 *           type: string
 *           description: Title of the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the post was last updated
 *
 *     CreatePost:
 *       type: object
 *       required:
 *         - description
 *         - title
 *         - senderId
 *       properties:
 *         description:
 *           type: string
 *           description: Description of the post
 *           example: "Having a great day!"
 *         title:
 *           type: string
 *           description: Title of the post
 *           example: "My first post title"
 *         senderId:
 *           type: string
 *           description: User ID of the sender
 *           example: "67a1d205c689f9a4e5476a1b"
 *
 *     UpdatePost:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: Description of the post
 *           example: "Having a great day!"
 *         title:
 *           type: string
 *           description: Title of the post
 *           example: "My first post title"
 *         senderId:
 *           type: string
 *           description: User ID of the sender
 *           example: "67a1d205c689f9a4e5476a1b"
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       '200':
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.get("/", wrapController(PostController.getAllPosts));

/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Get posts by sender ID
 *     tags: [Posts]
 *     parameters:
 *       - name: senderId
 *         in: query
 *         required: true
 *         description: ID of the sender
 *         example: "67a1d205c689f9a4e5476a1b"
 *     responses:
 *       '200':
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
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
 *                   example: "Invalid sender ID"
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Post not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.get("/sender", ValidateRequest(getPostsBySenderIdSchema), wrapController(PostController.getPostsBySenderId));

/**
 * @swagger
 * /posts/:id:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post
 *         example: "67a1d205c689f9a4e5476a1b"
 *     responses:
 *       '200':
 *         description: A post by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Post not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.get("/:id", ValidateRequest(getPostByIdSchema), wrapController(PostController.getPostById));

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
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
 *                   example: "Invalid request body"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.post("/", ValidateRequest(createPostSchema), wrapController(PostController.createPost));

/**
 * @swagger
 * /posts/:id:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post
 *         example: "67a1d205c689f9a4e5476a1b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
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
 *                   example: "Invalid request body"
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Post not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.put("/:id", ValidateRequest(updatePostSchema), wrapController(PostController.updatePost));

/**
 * @swagger
 * /posts/:id:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post
 *         example: "67a1d205c689f9a4e5476a1b"
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Post <id> deleted successfully"
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Post not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
postRouter.delete("/:id", ValidateRequest(deletePostByIdSchema), wrapController(PostController.deletePostById));

export default postRouter;
