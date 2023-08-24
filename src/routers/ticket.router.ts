import * as express from "express";
import {Ticket} from "../ticket";
import {Auth} from "../auth";
import {Request, Response} from "express";
import {NotFoundError} from "../error";

export const TicketRouter = express.Router();

TicketRouter.use(express.json());

TicketRouter.get("/", Auth(async (request: Request, response: Response) => {
    const tickets = await Ticket.fetchAll();
    response.status(200).send(tickets);
}));

TicketRouter.get("/channel/:channelId", Auth(async (request: Request, response: Response) => {
    const channelId = request?.params?.channelId;
    const ticket = await Ticket.fetch(channelId);
    response.status(200).send(ticket);
}));

TicketRouter.get("/owner/:ownerId", Auth(async (request: Request, response: Response) => {
    const ownerId = request?.params?.ownerId;
    const tickets = await Ticket.fetchByOwner(ownerId);
    response.status(200).send(tickets);
}));

TicketRouter.post("/", Auth(async (request: Request, response: Response) => {
    const ticket = request.body;
    await Ticket.save(ticket);
    response.status(200).send("Success");
}));

TicketRouter.delete("/:ticketId", Auth(async (request: Request, response: Response) => {
    const ticketId = request?.params?.ticketId;
    const { deletedCount } = await Ticket.delete(ticketId);
    if (deletedCount < 1) throw new NotFoundError(`Ticket Not Found\nId: ${ticketId}`);
    else response.status(200).send("Success");
}));