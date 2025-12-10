import request from "supertest";
import mongoose from "mongoose";
import { Application } from "express";
import { UserModel } from "../express/users/model";
import testUsers from "./users_tests.json";
import { initializeMongo } from "..";
import { Server } from "../express/server";
import config from "../config";
import { logger } from "../utils/logger";

let app: Application;
let server: Server;

beforeAll(async () => {
    logger.info("beforeAll");
    await initializeMongo();
    server = new Server(config.server.port);
    await server.start();
    app = server.expressApp;

    await UserModel.deleteMany();
});

afterAll((done) => {
    logger.info("afterAll");
    mongoose.connection.close();
    server.stop();
    done();
});

let userId = "";

describe("User API Integration Tests", () => {
    test("creates a new user with email and password", async () => {
        const response = await request(app).post("/users").send(testUsers[0]);

        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.username).toBe(testUsers[0].username);
        expect(response.body.email).not.toBe(testUsers[1].email);

        userId = response.body._id;
        expect(userId).toBeDefined();
    });

    test("retrieves all users from the database", async () => {
        const response = await request(app).get("/users");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    test("retrieves a user by their ID", async () => {
        const response = await request(app).get(`/users/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.username).toBe(testUsers[0].username);
    });

    test("updates a user's password using their ID", async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .send({ password: "updatedpassword", username: "updatedusername" });

        expect(response.statusCode).toBe(200);
    });

    test("deletes a user by their ID", async () => {
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.statusCode).toBe(200);

        const response2 = await request(app).get(`/users/${userId}`);
        expect(response2.statusCode).toBe(404);
    });
});
