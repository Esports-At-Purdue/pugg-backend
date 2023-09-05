import * as dotenv from "dotenv";
import * as express from "express";
import {Database} from "./database";
import {StudentRouter} from "./routers/student.router";
import {TicketRouter} from "./routers/ticket.router";
import {MenuRouter} from "./routers/menu.router";
import {ServerRouter} from "./routers/server.router";
import {EmailRouter} from "./routers/email.router";
import {SheetsRouter} from "./routers/sheets.router";
import {PlayerRouter} from "./routers/player.router";
import {TeamRouter} from "./routers/team.router";
import {GameRouter} from "./routers/game.router";
import {GgwpRouter} from "./routers/ggwp.router";

dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });

Database.load().then(async () => {
    const app = express();
    app.use("/ggwp", GgwpRouter);
    app.use("/sheets", SheetsRouter);
    app.use("/email", EmailRouter);
    app.use("/servers", ServerRouter);
    app.use("/students", StudentRouter);
    app.use("/players", PlayerRouter);
    app.use("/teams", TeamRouter);
    app.use("/games", GameRouter);
    app.use("/tickets", TicketRouter);
    app.use("/menus", MenuRouter);
    app.listen(1560);
});