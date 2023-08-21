import * as express from "express";
import {Ticket} from "../ticket";

export const TicketRouter = express.Router();

TicketRouter.use(express.json());

TicketRouter.get("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const tickets = await Ticket.fetchAll();
        response.status(200).send(tickets);

    } catch (error) {
        response.status(500).send(error);
    }
});

TicketRouter.get("/channel/:channelId", async (request, response)=> {
    try {

        const key = request?.header("key");
        const channelId = request?.params?.channelId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const ticket = await Ticket.fetch(channelId);
        response.status(200).send(ticket);

    } catch (error) {
        response.status(404).send(error);
    }
});

TicketRouter.get("/owner/:ownerId", async (request, response)=> {
    try {

        const key = request?.header("key");
        const ownerId = request?.params?.ownerId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const tickets = await Ticket.fetchByOwner(ownerId);
        response.status(200).send(tickets);

    } catch (error) {
        response.status(404).send(error);
    }
});

TicketRouter.post("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const { channelId, ownerId, reason, content, status } = request.body;
        await new Ticket(channelId, ownerId, reason, content, status).save();
        response.status(200).send("Success");

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

TicketRouter.delete("/:ticketId", async (request, response) => {
    try {

        const key = request?.header("key");
        const ticketId = request?.params?.ticketId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const { deletedCount } = await Ticket.delete(ticketId);
        if (deletedCount < 1) response.status(404).send({  });
        else response.status(200).send("Success");


    } catch (error) {
        response.status(500).send(error);
    }
});