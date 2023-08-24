import * as express from "express";
import {Menu} from "../menu";
import {Auth} from "../auth";
import {Request, Response} from "express";

export const MenuRouter = express.Router();

MenuRouter.use(express.json());

MenuRouter.get("/", Auth(async (request: Request, response: Response) => {
    const menus = await Menu.fetchAll();
    response.status(200).send(menus);
}));

MenuRouter.get("/:guildId/:menuName", Auth(async (request: Request, response: Response) => {
    const guildId = request?.params?.guildId;
    const menuName = request?.params?.menuName;
    const menu = await Menu.fetch(menuName, guildId);
    response.status(200).send(menu);
}));

MenuRouter.get("/:guildId", Auth(async (request: Request, response: Response) => {
    const guildId = request?.params?.guildId;
    const menus = await Menu.fetchByGuild(guildId);
    response.status(200).send(menus);
}));

MenuRouter.post("/", Auth(async (request: Request, response: Response) => {
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
}));

MenuRouter.delete("/:guildId/:menuName", Auth(async (request: Request, response: Response) => {
    const guildId = request?.params?.guildId;
    const menuName = request?.params?.menuName;const { deletedCount } = await Menu.delete(menuName, guildId);
    if (deletedCount < 1) response.status(404).send({  });
    else response.status(200).send("Success");
}));