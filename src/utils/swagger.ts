import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Express } from "express";
import config from "../config";

const { server } = config;

export const initializeSwagger = (app: Express) => {
    const swaggerOptions = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "API",
                version: "1.0.0",
                description: "API for the Web Assignment 2",
            },
            servers: [{ url: `http://localhost:${server.port}` }],
        },
        apis: ["./src/express/**/*.router.ts"],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    app.use(server.swaggerUrl, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
