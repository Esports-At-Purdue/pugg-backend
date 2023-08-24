import {Request, Response} from "express";
import {NotFoundError} from "./error";

export function Auth(controller: Function) {
    return async function(request: Request, response: Response, next: Function) {
        try {
            const key = request?.header("key");

            if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
                response.status(403).send("Invalid Key");
                return;
            }

            await controller(request, response, next);
        } catch (error) {
            const code = error instanceof NotFoundError ? 404 : 500;
            response.status(code).send(error);
        }
    };
}