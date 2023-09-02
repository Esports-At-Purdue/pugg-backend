import * as express from "express";
import {Auth} from "../auth";
import {Request, Response} from "express";
import {Team} from "../team";

export const TeamRouter = express.Router();

TeamRouter.use(express.json());

TeamRouter.get("/", Auth(async (request: Request, response: Response) => {
    const teams = await Team.fetchAll();
    response.status(200).send(teams);
}));

TeamRouter.get("/:teamName", Auth(async (request: Request, response: Response) => {
    const teamName = request?.params?.teamName;
    const team = await Team.fetch(teamName);
    response.status(200).send(team);
}));

TeamRouter.post("/", Auth(async (request: Request, response: Response) => {
    const team = request.body;
    await Team.save(team);
    response.status(200).send("Success");
}));

TeamRouter.delete("/:teamName", Auth(async (request: Request, response: Response) => {
    const teamName = request?.params?.teamName;
    await Team.delete(teamName);
    response.status(200).send("Success");
}));
