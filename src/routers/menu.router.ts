import * as express from "express";
import {Menu} from "../menu";

export const MenuRouter = express.Router();

MenuRouter.use(express.json());

MenuRouter.get("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const menus = await Menu.fetchAll();
        response.status(200).send(menus);

    } catch (error) {
        response.status(500).send(error);
    }
});

MenuRouter.get("/:guildId/:menuName", async (request, response)=> {
    try {

        const key = request?.header("key");
        const guildId = request?.params?.guildId;
        const menuName = request?.params?.menuName;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const menu = await Menu.fetch(menuName, guildId);
        response.status(200).send(menu);

    } catch (error) {
        response.status(404).send(error);
    }
});

MenuRouter.get("/:guildId", async (request, response)=> {
    try {

        const key = request?.header("key");
        const guildId = request?.params?.guildId;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const menus = await Menu.fetchByGuild(guildId);
        response.status(200).send(menus);

    } catch (error) {
        response.status(404).send(error);
    }
});

MenuRouter.post("/", async (request, response) => {
    try {

        const key = request?.header("key");

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const menu = request.body;
        await Menu.save(menu);
        response.status(200).send("Success");

    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

MenuRouter.delete("/:guildId/:menuName", async (request, response) => {
    try {

        const key = request?.header("key");
        const guildId = request?.params?.guildId;
        const menuName = request?.params?.menuName;

        if (!process.env.MONGO_KEY || key != process.env.MONGO_KEY) {
            response.status(403).send("Invalid Key");
            return;
        }

        const { deletedCount } = await Menu.delete(menuName, guildId);
        if (deletedCount < 1) response.status(404).send({  });
        else response.status(200).send("Success");


    } catch (error) {
        response.status(500).send(error);
    }
});