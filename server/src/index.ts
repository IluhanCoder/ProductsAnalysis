import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import router from "./router";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
    console.log(`server has been started on port ${port}`);
})