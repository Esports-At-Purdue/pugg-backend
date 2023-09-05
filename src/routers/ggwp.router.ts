import * as express from "express";
import {Request, Response} from "express";

export const GgwpRouter = express.Router();

GgwpRouter.use(express.json());

GgwpRouter.post("/auth", async (request: Request, response: Response) => {

    response.status(200).send();
});