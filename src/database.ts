import { Collection, MongoClient } from "mongodb";

export class Database {
    public static servers: Collection;
    public static students: Collection;
    public static players: Collection;
    public static teams: Collection;
    public static games: Collection;
    public static tickets: Collection;
    public static menus: Collection;

    public static async load() {
        const connectionString = process.env.MONGO_CONNECTION_STRING as string;
        const client = await new MongoClient(connectionString).connect();
        const database = client.db("Purdue");
        Database.servers = database.collection("servers");
        Database.students = database.collection("students-new");
        Database.players = database.collection("players-new");
        Database.teams = database.collection("teams-new");
        Database.games = database.collection("games-new");
        Database.tickets = database.collection("tickets-new");
        Database.menus = database.collection("menus");
    }
}