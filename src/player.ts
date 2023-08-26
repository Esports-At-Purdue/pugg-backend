import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Player {
    public static async save(player: any) {
        const query: Filter<any> = { id: player.id };
        const update: UpdateFilter<any> = { $set: player };
        const options: UpdateOptions = { upsert: true };
        return await Database.players.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.players.findOne(query);
        if (!document) throw new NotFoundError(`Player Not Found\nId: ${id}`);
        return document;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.players.find(query).toArray();
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        const { deletedCount } = await Database.players.deleteOne(query);
        if (deletedCount < 1) throw new NotFoundError(`Player Not Found\nId: ${id}`);
    }
}