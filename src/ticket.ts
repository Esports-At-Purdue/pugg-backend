import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Ticket {
    public channelId:   string;
    public ownerId:     string;
    public reason:      string;
    public content:     TicketMessage[];
    public status:      TicketStatus;

    constructor(channelId: string, ownerId: string, reason: string, content: TicketMessage[], status: TicketStatus) {
        this.channelId = channelId;
        this.ownerId = ownerId;
        this.reason = reason;
        this.content = content;
        this.status = status;
    }

    public async save() {
        const query: Filter<any> = { channelId: this.channelId };
        const update: UpdateFilter<any> = { $set: this };
        const options: UpdateOptions = { upsert: true };
        return await Database.tickets.updateOne(query, update, options);
    }

    public static async fetch(channelId: string) {
        const query: Filter<any> = { channelId: channelId };
        const document = await Database.tickets.findOne(query);
        if (!document) throw new NotFoundError(`Ticket Not Found\nChannelId: ${channelId}`);
        return document as unknown as Ticket;
    }

    public static async fetchByOwner(ownerId: string) {
        const query: Filter<any> = { ownerId: ownerId };
        const documents = await Database.tickets.find(query).toArray();
        return documents.map(document => document as unknown as Ticket)
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        const documents = await Database.tickets.find(query).toArray();
        return documents.map(document => document as unknown as Ticket)
    }

    public static async delete(channelId: string) {
        const query: Filter<any> = { channelId: channelId };
        return await Database.tickets.deleteOne(query);
    }
}

class TicketMessage {
    public authorId: string;
    public authorUsername: string;
    public content: string;

    constructor( authorId: string, authorUsername: string, content: string) {
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.content = content;
    }
}

export enum TicketStatus {
    Closed,
    Open
}
