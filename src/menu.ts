import {ButtonStyle} from "discord-api-types/v10";
import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Menu {
    public name:    string;
    public guildId: string;
    public buttons: MenuButton[][];

    constructor(name: string, guildId: string, rows: MenuButton[][]) {
        this.name = name;
        this.guildId = guildId;
        this.buttons = rows;
    }

    public async save() {
        const query: Filter<any> = { name: this.name, guildId: this.guildId };
        const update: UpdateFilter<any> = { $set: this };
        const options: UpdateOptions = { upsert: true };
        return await Database.menus.updateOne(query, update, options);
    }

    public static async fetch(name: string, guildId: string) {
        const query: Filter<any> = { name: name, guildId: guildId };
        const document = await Database.menus.findOne(query);
        if (!document) throw new NotFoundError(`Menu Not Found\nName: ${name}\nGuildId: ${guildId}`);
        return document as unknown as Menu;
    }

    public static async fetchByGuild(guildId: string) {
        const query: Filter<any> = { guildId: guildId };
        const documents = await Database.menus.find(query).toArray();
        return documents.map(document => document as unknown as Menu);
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        const documents = await Database.menus.find(query).toArray();
        return documents.map(document => document as unknown as Menu);
    }

    public static async delete(name: string, guildId: string) {
        const query: Filter<any> = { name: name, guildId: guildId };
        return await Database.menus.deleteOne(query);
    }
}

class MenuButton {
    public id: string;
    public style: ButtonStyle;
    public label: string;
    public emoji: string

    constructor(id: string, style: ButtonStyle, label: string, emoji: string) {
        this.id = id;
        this.style = style;
        this.label = label;
        this.emoji = emoji;
    }
}