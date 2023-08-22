import {Student} from "../student";
import axios from "axios";
import * as crypto from "crypto";
import * as express from "express";
import * as fs from "fs";
import {Server} from "../server";


export const StudentRouter = express.Router();

StudentRouter.use(express.json());

StudentRouter.get("/", async (request, response) => {
    try {
        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const students = await Student.fetchAll();
        response.status(200).send(students);

    } catch (error) {
        response.status(500).send(error);
    }
});

StudentRouter.get("/:studentId", async (request, response)=> {
    try {
        const key = request?.header("key");
        const studentId = request?.params?.studentId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const student = await Student.fetch(studentId);
        response.status(200).send(student);

    } catch (error) {
        response.status(404).send(error);
    }
});

StudentRouter.get("/verify/:hash", async (request, response) => {
    try {
        const hashString = request?.params?.hash;
        const { serverId, studentId, time } = processRequest(hashString);

        if (Date.now() - time > 900000 || !time) {
            const html = fs.readFileSync(`./src/media/expired.html`).toString();
            response.status(400).send(html);
            return;
        }

        const server = await Server.fetch(serverId);
        const student = await Student.fetch(studentId);

        if (!student || !server) {
            console.log("Verify Request Errored")
            throw new Error();
        }

        student.verified = true;
        await Student.save(student);

        const headers = { key: process.env.BACKEND_KEY };
        await axios.post(`${process.env.DISCORD_URL}/${serverId}/${studentId}`, {  }, { headers: headers });
        const html = fs.readFileSync(`./src/media/success.html`).toString();
        response.status(200).send(html);

    } catch (error) {
        //console.log(error)
        const html = fs.readFileSync(`./src/media/error.html`).toString();
        response.status(404).send(html);
    }
})

StudentRouter.post("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const student = request.body;
        await Student.save(student);
        response.status(200).send("Success");

    } catch (error) {
        response.status(500).send(error);
    }
});

StudentRouter.delete("/:studentId", async (request, response) => {
    try {

        const key = request?.header("key");
        const studentId = request?.params?.studentId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const { deletedCount } = await Student.delete(studentId);
        if (deletedCount < 1) response.status(404).send({  });
        else response.status(200).send("Success");


    } catch (error) {
        response.status(500).send(error);
    }
});

function processRequest(hashString: string) {
    const iv = hashString.split("-")[0];
    const content = hashString.split("-")[1];
    const hash = { iv: iv, content: content};
    const decipher = crypto.createDecipheriv("aes-256-ctr", process.env.BACKEND_KEY as string, Buffer.from(hash.iv, 'hex'));
    const bufferList = [ decipher.update(Buffer.from(hash.content, "hex")), decipher.final() ];
    const decryptedBuffer = Buffer.concat(bufferList);
    const decryptedString = decryptedBuffer.toString();
    const serverId = decryptedString.split("-")[0];
    const studentId = decryptedString.split("-")[1];
    const time = Number.parseInt(decryptedString.split("-")[2]);
    return { serverId: serverId, studentId: studentId, time: time };
}