import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {Database} from "./database";
import {NotFoundError} from "./error";

export class Student {

    public static async save(student: any) {
        const query: Filter<any> = { id: student.id };
        const update: UpdateFilter<any> = { $set: student };
        const options: UpdateOptions = { upsert: true };
        return await Database.students.updateOne(query, update, options);
    }

    public static async fetch(id: string) {
        const query: Filter<any> = { id: id };
        const document = await Database.students.findOne(query);
        if (!document) throw new NotFoundError(`Student Not Found\nStudentId: ${id}`);
        return document;
    }

    public static async fetchAll() {
        const query: Filter<any> = {  };
        return await Database.students.find(query).toArray();
    }

    public static async delete(id: string) {
        const query: Filter<any> = { id: id };
        return await Database.students.deleteOne(query);
    }
}
