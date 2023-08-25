import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Server {

    public static async save(server: any) {
        const query: Filter<any> = { id: server.id };
        const update: UpdateFilter<any> = { $set: server };
        const options: UpdateOptions = { upsert: true };
        return await Database.servers.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.servers.findOne(query);
        if (!document) throw new NotFoundError(`Server Not Found\nServerId: ${id}`);
        return document;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.servers.find(query).toArray();
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        const { deletedCount } = await Database.servers.deleteOne(query);
        if (deletedCount < 1) throw new NotFoundError(`Server Not Found\nId: ${id}`);
    }
}