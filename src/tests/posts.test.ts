import request from "supertest";
import mongoose from "mongoose";
import { Application } from "express";
import { UserModel } from "../express/users/model";
import { PostModel } from "../express/posts/model";
import postsTests from "./posts_tests.json";
import { initializeMongo } from "..";
import { Server } from "../express/server";
import config from "../config";
import { logger } from "../utils/logger";

let app: Application;

beforeAll(async () => {
    logger.info("beforeAll");
    await initializeMongo();
    const server = new Server(config.server.port);
    await server.start();
    app = server.expressApp;

    await PostModel.deleteMany();
    await UserModel.deleteMany();
});

afterAll((done) => {
    logger.info("afterAll");
    mongoose.connection.close();
    done();
});

const baseUrl = "/posts";

let newPostId = "";

describe("posts tests", () => {
    test("get all posts", async () => {
        const response = await request(app).get(baseUrl);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("create new post", async () => {
        const response = await request(app).post(baseUrl).send(postsTests[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(postsTests[0].title);
        expect(response.body.senderId).toBe(postsTests[0].senderId);
        expect(response.body.description).toBe(postsTests[0].description);
        newPostId = response.body._id;
    });

    test("get post by id", async () => {
        const response = await request(app).get(baseUrl + "/" + newPostId);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(postsTests[0].title);
        expect(response.body.senderId).toBe(postsTests[0].senderId);
        expect(response.body.description).toBe(postsTests[0].description);
    });

    test("get post by userId", async () => {
        const response = await request(app).get(baseUrl + "?senderId=" + postsTests[0].senderId);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe(postsTests[0].title);
        expect(response.body[0].description).toBe(postsTests[0].description);
    });

    test("delete post", async () => {
        const response = await request(app).delete(baseUrl + "/" + newPostId);
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get(baseUrl + "/" + newPostId);
        expect(response2.statusCode).toBe(404);
    });
});
