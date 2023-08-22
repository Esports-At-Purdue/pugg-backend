import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Ticket {

    public static async save(ticket: any) {
        const query: Filter<any> = { channelId: ticket.channelId };
        const update: UpdateFilter<any> = { $set: ticket };
        const options: UpdateOptions = { upsert: true };
        return await Database.tickets.updateOne(query, update, options);
    }

    public static async fetch(channelId: string) {
        const query: Filter<any> = { channelId: channelId };
        const document = await Database.tickets.findOne(query);
        if (!document) throw new NotFoundError(`Ticket Not Found\nChannelId: ${channelId}`);
        return document;
    }

    public static async fetchByOwner(ownerId: string) {
        const query: Filter<any> = { ownerId: ownerId };
        return await Database.tickets.find(query).toArray();
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.tickets.find(query).toArray();
    }

    public static async delete(channelId: string) {
        const query: Filter<any> = { channelId: channelId };
        return await Database.tickets.deleteOne(query);
    }
}