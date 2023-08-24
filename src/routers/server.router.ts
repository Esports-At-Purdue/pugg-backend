import * as express from "express";
import {Server} from "../server";
import {Auth} from "../auth";
import {Request, Response} from "express";
import {NotFoundError} from "../error";

export const ServerRouter = express.Router();

ServerRouter.use(express.json());

ServerRouter.get("/", Auth(async (request: Request, response: Response) => {
    const servers = await Server.fetchAll();
    response.status(200).send(servers);
}));

ServerRouter.get("/:serverId", Auth(async (request: Request, response: Response) => {
    const serverId = request?.params?.serverId;
    const server = await Server.fetch(serverId);
    response.status(200).send(server);
}));

ServerRouter.post("/", Auth(async (request: Request, response: Response) => {
    const server = request.body;
    await Server.save(server);
    response.status(200).send("Success");
}));

ServerRouter.delete("/:serverId", Auth(async (request: Request, response: Response) => {
    const serverId = request?.params?.serverId;
    const { deletedCount } = await Server.delete(serverId);
    if (deletedCount < 1) throw new NotFoundError(`Server Not Found\nId: ${serverId}`);
    response.status(200).send("Success");
}));