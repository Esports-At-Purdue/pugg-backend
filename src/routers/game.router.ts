import * as express from "express";
import {Auth} from "../auth";
import {Request, Response} from "express";
import {Game} from "../game";

export const GameRouter = express.Router();

GameRouter.use(express.json());

GameRouter.get("/", Auth(async (request: Request, response: Response) => {
    const games = await Game.fetchAll();
    response.status(200).send(games);
}));

GameRouter.get("/:gameId", Auth(async (request: Request, response: Response) => {
    const gameId = request?.params?.gameId;
    const game = await Game.fetch(gameId);
    response.status(200).send(game);
}));

GameRouter.post("/", Auth(async (request: Request, response: Response) => {
    const game = request.body;
    await Game.save(game);
    response.status(200).send("Success");
}));

GameRouter.delete("/:gameId", Auth(async (request: Request, response: Response) => {
    const gameId = request?.params?.gameId;
    await Game.delete(gameId);
    response.status(200).send("Success");
}));
