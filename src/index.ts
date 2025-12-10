import mongoose from "mongoose";
import config from "./config/index";
import { Server } from "./express/server";
import { logger } from "./utils/logger/index";

const { mongo } = config;

const initializeMongo = async () => {
  logger.info("Connecting to Mongo...");

  await mongoose.connect(mongo.url);

  logger.info("Mongo connection established");
};

const main = async () => {
  await initializeMongo();

  const server = new Server(config.server.port);

  await server.start();

  logger.info(`Server started on port: ${config.server.port}`);
};

main().catch(logger.error);
