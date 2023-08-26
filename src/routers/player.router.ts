import * as express from "express";
import {Auth} from "../auth";
import {Request, Response} from "express";
import {Player} from "../player";

export const PlayerRouter = express.Router();

PlayerRouter.use(express.json());

PlayerRouter.get("/", Auth(async (request: Request, response: Response) => {
    const players = await Player.fetchAll();
    response.status(200).send(players);
}));

PlayerRouter.get("/:playerId", Auth(async (request: Request, response: Response) => {
    const playerId = request?.params?.playerId;
    const player = await Player.fetch(playerId);
    response.status(200).send(player);
}));

PlayerRouter.post("/", Auth(async (request: Request, response: Response) => {
    const player = request.body;
    await Player.save(player);
    response.status(200).send("Success");
}));

PlayerRouter.delete("/:playerId", Auth(async (request: Request, response: Response) => {
    const playerId = request?.params?.playerId;
    await Player.delete(playerId);
    response.status(200).send("Success");
}));
