import * as express from "express";
import {google} from "googleapis";
import {NotFoundError} from "../error";

export const SheetsRouter = express.Router();

SheetsRouter.use(express.json())

SheetsRouter.get("/players/:playerId", async (request, response) => {
    try {
        const key = request?.header("key");
        const playerId = request.params?.playerId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const spreadsheet = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEETS_ID,
            range: "LFT!A1:Z",
            auth: auth
        });

        if (!spreadsheet.data.values) throw new NotFoundError(`Spreadsheet Data Not Found\nSheetId: ${process.env.SHEETS_ID}`);

        for (const [ index, row ] of spreadsheet.data.values.entries()) {
            const id = row.at(0);
            if (id == playerId) response.status(200).send({ row: row, index: index + 1 });
        }

        response.status(404).send()

    } catch (error) {
        response.status(500).send(error);
    }
});

SheetsRouter.get("/teams/:teamName", async (request, response) => {
    try {
        const key = request?.header("key");
        const teamName = request.params?.teamName;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const spreadsheet = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEETS_ID,
            range: "LFP!A1:Z",
            auth: auth
        });

        if (!spreadsheet.data.values) throw new NotFoundError(`Spreadsheet Data Not Found\nSheetId: ${process.env.SHEETS_ID}`);

        for (const [ index, row ] of spreadsheet.data.values.entries()) {
            const name = row.at(1);
            if (name.toLowerCase() == teamName.toLowerCase()) response.status(200).send({ row: row, index: index + 1 });
        }

        response.status(404).send()

    } catch (error) {
        response.status(500).send(error);
    }
});

SheetsRouter.post("/players", async (request, response) => {
    try {
        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const { id, name, experience, hours, roles, year, other } = request.body;
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEETS_ID,
            range: "LFT!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [ [ id, name, experience, hours, roles, year, other, new Date().toDateString() ] ]
            },
            auth: auth
        });

        response.status(200).send()

    } catch (error) {
        response.status(500).send(error);
    }
});

SheetsRouter.post("/teams", async (request, response) => {
    try {
        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const { ownerId, name, experience, hours, roles, year, other } = request.body;
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEETS_ID,
            range: "LFP!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [ [ ownerId, name, experience, hours, roles, year, other, new Date().toDateString() ] ]
            },
            auth: auth
        });

        response.status(200).send()

    } catch (error) {
        response.status(500).send(error);
    }
});

SheetsRouter.put("/players", async (request, response) => {
    try {
        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const { id, index, name, experience, hours, roles, year, other } = request.body;
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEETS_ID,
            range: `LFT!A${index}:Z${index}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                range: `LFT!A${index}:Z${index}`,
                majorDimension: "ROWS",
                values: [ [ id, name, experience, hours, roles, year, other, new Date().toDateString() ] ]
            },
            auth: auth
        });

        response.status(200).send()

    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

SheetsRouter.put("/teams", async (request, response) => {
    try {
        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const sheets = google.sheets("v4");
        const auth = await google.auth.getClient({
            keyFilename: "google.json",
            scopes: [ "https://www.googleapis.com/auth/spreadsheets" ]
        });

        const { ownerId, index, name, experience, hours, roles, year, other } = request.body;
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEETS_ID,
            range: `LFP!A${index}:Z${index}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                range: `LFP!A${index}:Z${index}`,
                majorDimension: "ROWS",
                values: [ [ ownerId, name, experience, hours, roles, year, other, new Date().toDateString() ] ]
            },
            auth: auth
        });

        response.status(200).send()

    } catch (error) {
        response.status(500).send(error);
    }
});