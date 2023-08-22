import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Menu {

    public static async save(menu: any) {
        const query: Filter<any> = { name: menu.name, guildId: menu.guildId };
        const update: UpdateFilter<any> = { $set: menu };
        const options: UpdateOptions = { upsert: true };
        return await Database.menus.updateOne(query, update, options);
    }

    public static async fetch(name: string, guildId: string) {
        const query: Filter<any> = { name: name, guildId: guildId };
        const document = await Database.menus.findOne(query);
        if (!document) throw new NotFoundError(`Menu Not Found\nName: ${name}\nGuildId: ${guildId}`);
        return document;
    }

    public static async fetchByGuild(guildId: string) {
        const query: Filter<any> = { guildId: guildId };
        return await Database.menus.find(query).toArray();
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.menus.find(query).toArray();
    }

    public static async delete(name: string, guildId: string) {
        const query: Filter<any> = { name: name, guildId: guildId };
        return await Database.menus.deleteOne(query);
    }
}