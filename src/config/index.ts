import env from "env-var";
import "./dotenv";

const config = {
    server: {
        port: env.get("SERVER_PORT").default(3000).asPortNumber(),
        swaggerUrl: env.get("SWAGGER_URL").default("/api-docs").asString(),
    },
    mongo: {
        url: env.get("MONGO_URL").default("mongodb://localhost:27017/").asUrlString(),
        postsCollectionName: env.get("POSTS_COLLECTION_NAME").default("posts").required().asString(),
        commentsCollectionName: env.get("COMMENTS_COLLECTION_NAME").default("comments").required().asString(),
        usersCollectionName: env.get("USERS_COLLECTION_NAME").default("users").required().asString(),
    },
    auth: {
        saltRounds: env.get("GEN_SALT_ROUNDS").default(10).asIntPositive(),
    },
    test: {
        comments: {
            route: "/comments",
        },
        posts: {
            route: "/posts",
        },
        users: {
            route: "/users",
        },
    },
};

export default config;
