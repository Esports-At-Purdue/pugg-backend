import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Team {
    public static async save(team: any) {
        const query: Filter<any> = { name: team.name };
        const update: UpdateFilter<any> = { $set: team };
        const options: UpdateOptions = { upsert: true };
        return await Database.teams.updateOne(query, update, options);
    }

    public static async fetch(name: string) {
        const query: Filter<any> = { name: name };
        const document = await Database.teams.findOne(query);
        if (!document) throw new NotFoundError(`Team Not Found\nName: ${name}`);
        return document;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.teams.find(query).toArray();
    }

    public static async delete(name: string) {
        const query: Filter<any> = { name: name };
        const { deletedCount } = await Database.teams.deleteOne(query);
        if (deletedCount < 1) throw new NotFoundError(`Team Not Found\nId: ${name}`);
    }
}