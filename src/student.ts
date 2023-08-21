import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Student {
    public id:          string;
    public username:    string;
    public email:       string;
    public verified:    boolean;

    public constructor(id: string, username: string, email: string, verified: boolean) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.verified = verified;
    }

    public async save() {
        const query: Filter<any> = { id: this.id };
        const update: UpdateFilter<any> = { $set: this };
        const options: UpdateOptions = { upsert: true };
        return await Database.students.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.students.findOne(query);
        if (!document) throw new NotFoundError(`Student Not Found\nStudentId: ${id}`);
        const { username, email, verified } = document;
        return new Student(id, username, email, verified);
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        const documents = await Database.students.find(query).toArray();
        return documents.map(document => document as unknown as Student)
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        return await Database.students.deleteOne(query);
    }
}
