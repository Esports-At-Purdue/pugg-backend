import * as express from "express";
import {Server} from "../server";

export const ServerRouter = express.Router();

ServerRouter.use(express.json());

ServerRouter.get("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const servers = await Server.fetchAll();
        response.status(200).send(servers);

    } catch (error) {
        response.status(500).send(error);
    }
});

ServerRouter.get("/:serverId", async (request, response)=> {
    try {

        const key = request?.header("key");
        const serverId = request?.params?.serverId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const server = await Server.fetch(serverId);
        response.status(200).send(server);

    } catch (error) {
        response.status(404).send(error);
    }
});

ServerRouter.post("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const server = request.body;
        await Server.save(server);
        response.status(200).send("Success");

    } catch (error) {
        response.status(500).send(error);
    }
});

ServerRouter.delete("/:serverId", async (request, response) => {
    try {

        const key = request?.header("key");
        const serverId = request?.params?.serverId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const { deletedCount } = await Server.delete(serverId);
        if (deletedCount < 1) response.status(404).send({  });
        else response.status(200).send("Success");


    } catch (error) {
        response.status(500).send(error);
    }
});