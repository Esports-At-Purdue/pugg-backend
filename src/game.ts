import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Game {
    public static async save(game: any) {
        const query: Filter<any> = { id: game.id };
        const update: UpdateFilter<any> = { $set: game };
        const options: UpdateOptions = { upsert: true };
        return await Database.games.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.games.findOne(query);
        if (!document) throw new NotFoundError(`Game Not Found\nName: ${id}`);
        return document;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.games.find(query).toArray();
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        const { deletedCount } = await Database.games.deleteOne(query);
        if (deletedCount < 1) throw new NotFoundError(`Game Not Found\nId: ${id}`);
    }
}