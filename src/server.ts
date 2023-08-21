import {APIEmoji} from "discord-api-types/v10";
import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Server {
    public id:       string;
    public name:     string;
    public settings: ServerSettings;

    constructor(id: string, name: string, settings: ServerSettings) {
        this.id = id;
        this.name = name;
        this.settings = settings;
    }

    public async save() {
        const query: Filter<any> = { id: this.id };
        const update: UpdateFilter<any> = { $set: this };
        const options: UpdateOptions = { upsert: true };
        return await Database.servers.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.servers.findOne(query);
        if (!document) throw new NotFoundError(`Server Not Found\nServerId: ${id}`);
        return document as unknown as Server;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        const documents = await Database.servers.find(query).toArray();
        return documents.map(document => document as unknown as Server);
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        return await Database.servers.deleteOne(query);
    }
}

class ServerSettings {
    public token:    string;
    public emotes:   APIEmoji[];
    public roles:    RoleSettings;
    public channels: ChannelSettings;

    constructor(token: string, emotes: APIEmoji[], roles: RoleSettings,  channels: ChannelSettings) {
        this.token = token;
        this.emotes = emotes;
        this.roles = roles;
        this.channels = channels;
    }
}

class RoleSettings {
    public member: string;
    public purdue: string;

    constructor(member: string, purdue: string) {
        this.member = member;
        this.purdue = purdue;
    }
}

class ChannelSettings {
    public log:     string;
    public join:    string;
    public leave:   string;
    public admin:   string;
    public general: string;

    public constructor(log: string, join: string, leave: string, admin: string, general: string) {
        this.log = log;
        this.join = join;
        this.leave = leave;
        this.admin = admin;
        this.general = general;
    }
}