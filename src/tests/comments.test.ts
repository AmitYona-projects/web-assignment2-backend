import request from "supertest";
import mongoose from "mongoose";
import { Application } from "express";
import { CommentModel } from "../express/comments/model";
import { UserModel } from "../express/users/model";
import commentsTests from "./comments_tests.json";
import { initializeMongo } from "../utils/mongo";
import { Server } from "../express/server";
import config from "../config";
import { logger } from "../utils/logger";
import { IAuthResponse } from "../express/auth/interface";
import { getMockLoginUser } from "./utils";

let app: Application;
let server: Server;
let loginedUserData: IAuthResponse;

beforeAll(async () => {
    logger.info("beforeAll");
    await initializeMongo();
    server = new Server(config.server.port);
    await server.start();
    app = server.expressApp;

    await CommentModel.deleteMany();
    await UserModel.deleteMany();
    loginedUserData = await getMockLoginUser(app);
});

afterAll((done) => {
    logger.info("afterAll");
    mongoose.connection.close();
    server.stop();
    done();
});

const baseUrl = config.test.comments.route;

let newCommentId = "";

describe("comments tests", () => {
    test("get all comments", async () => {
        const response = await request(app).get(baseUrl);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("create new comment", async () => {
        const response = await request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${loginedUserData.accessToken}`)
            .send(commentsTests[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body.senderId).toBe(loginedUserData.user._id);
        expect(response.body.postId).toBe(commentsTests[0].postId);
        expect(response.body.commentText).toBe(commentsTests[0].commentText);
        newCommentId = response.body._id;
    });

    test("get comment by id", async () => {
        const response = await request(app).get(`${baseUrl}/${newCommentId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.senderId).toBe(loginedUserData.user._id);
        expect(response.body.postId).toBe(commentsTests[0].postId);
        expect(response.body.commentText).toBe(commentsTests[0].commentText);
    });

    test("get comment by userId", async () => {
        const response = await request(app).get(`${baseUrl}?senderId=${loginedUserData.user._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].postId).toBe(commentsTests[0].postId);
        expect(response.body[0].commentText).toBe(commentsTests[0].commentText);
    });

    test("delete comment", async () => {
        const response = await request(app)
            .delete(`${baseUrl}/${newCommentId}`)
            .set("Authorization", `Bearer ${loginedUserData.accessToken}`);
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get(`${baseUrl}/${newCommentId}`);
        expect(response2.statusCode).toBe(404);
    });
});
