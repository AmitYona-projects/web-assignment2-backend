import request from "supertest";
import mongoose from "mongoose";
import { Application } from "express";
import { UserModel } from "../express/users/model";
import { initializeMongo } from "../utils/mongo";
import { Server } from "../express/server";
import config from "../config";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";

let app: Application;
let server: Server;

beforeAll(async () => {
    logger.info("beforeAll - Auth Tests");
    await initializeMongo();
    server = new Server(config.server.port);
    await server.start();
    app = server.expressApp;

    await UserModel.deleteMany();
});

afterAll((done) => {
    logger.info("afterAll - Auth Tests");
    mongoose.connection.close();
    server.stop();
    done();
});

const testUser = {
    email: "auth-test@test.com",
    username: "authtestuser",
    password: "TestPassword123!",
};

const authBaseUrl = "/auth";

describe("Authentication API Tests", () => {
    let accessToken = "";
    let refreshToken = "";
    let userId = "";

    describe("User Registration", () => {
        test("registers a new user successfully", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send(testUser);

            expect(response.statusCode).toBe(201);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(testUser.email);
            expect(response.body.user.username).toBe(testUser.username);

            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
            userId = response.body.user._id;
        });

        test("fails to register with existing email", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send(testUser);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("already registered");
        });

        test("fails to register without email", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send({
                username: "newuser",
                password: "password123",
            });

            expect(response.statusCode).toBe(400);
        });

        test("fails to register without password", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send({
                email: "newuser@test.com",
                username: "newuser",
            });

            expect(response.statusCode).toBe(400);
        });

        test("fails to register without username", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send({
                email: "newuser@test.com",
                password: "password123",
            });

            expect(response.statusCode).toBe(400);
        });

        test("fails to register with invalid email format", async () => {
            const response = await request(app).post(`${authBaseUrl}/register`).send({
                email: "invalid-email",
                username: "newuser",
                password: "password123",
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe("User Login", () => {
        test("logs in successfully with correct credentials", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
                password: testUser.password,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(testUser.email);

            // Update tokens from login
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        test("fails to login with incorrect password", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
                password: "wrongpassword",
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toContain("Invalid email or password");
        });

        test("fails to login with non-existent email", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                email: "nonexistent@test.com",
                password: "password123",
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toContain("Invalid email or password");
        });

        test("fails to login without email", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                password: "password123",
            });

            expect(response.statusCode).toBe(400);
        });

        test("fails to login without password", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe("Token Refresh", () => {
        test("refreshes tokens successfully with valid refresh token", async () => {
            const response = await request(app)
                .post(`${authBaseUrl}/refresh-token`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    refreshToken: refreshToken,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            expect(response.body.user).toBeDefined();

            // Tokens should be different from the old ones
            expect(response.body.refreshToken).not.toBe(refreshToken);

            // Update tokens
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        test("fails to refresh with invalid refresh token", async () => {
            const response = await request(app).post(`${authBaseUrl}/refresh-token`).send({
                refreshToken: "invalid_refresh_token",
            });

            expect(response.statusCode).toBe(401);
        });

        test("fails to refresh without refresh token", async () => {
            const response = await request(app)
                .post(`${authBaseUrl}/refresh-token`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({});

            expect(response.statusCode).toBe(400);
        });

        test("fails to refresh with revoked refresh token", async () => {
            // First, logout to revoke the token
            await request(app).post(`${authBaseUrl}/logout`).send({
                refreshToken: refreshToken,
            });

            // Try to use the revoked token
            const response = await request(app).post(`${authBaseUrl}/refresh-token`).send({
                refreshToken: refreshToken,
            });

            expect(response.statusCode).toBe(401);
        });

        test("refreshes tokens and old refresh token becomes invalid", async () => {
            // Login to get fresh tokens
            const loginResponse = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
                password: testUser.password,
            });

            const oldRefreshToken = loginResponse.body.refreshToken;

            // Refresh tokens
            const refreshResponse = await request(app)
                .post(`${authBaseUrl}/refresh-token`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    refreshToken: oldRefreshToken,
                });

            expect(refreshResponse.statusCode).toBe(200);

            // Try to use old refresh token again
            const response = await request(app).post(`${authBaseUrl}/refresh-token`).send({
                refreshToken: oldRefreshToken,
            });

            expect(response.statusCode).toBe(401);
        });
    });

    describe("User Logout", () => {
        let logoutRefreshToken = "";

        beforeAll(async () => {
            // Login to get fresh tokens for logout tests
            const loginResponse = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
                password: testUser.password,
            });

            logoutRefreshToken = loginResponse.body.refreshToken;
        });

        test("logs out successfully with valid refresh token", async () => {
            const response = await request(app)
                .post(`${authBaseUrl}/logout`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    refreshToken: logoutRefreshToken,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain("Logout successful");
        });

        test("fails to logout without refresh token", async () => {
            const response = await request(app)
                .post(`${authBaseUrl}/logout`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({});

            expect(response.statusCode).toBe(400);
        });

        test("fails to use refresh token after logout", async () => {
            const response = await request(app).post(`${authBaseUrl}/refresh-token`).send({
                refreshToken: logoutRefreshToken,
            });

            expect(response.statusCode).toBe(401);
        });

        test("can login again after logout", async () => {
            const response = await request(app).post(`${authBaseUrl}/login`).send({
                email: testUser.email,
                password: testUser.password,
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        });
    });
});
