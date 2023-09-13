import compression from "compression";
import express from "express";
import { default as helmet } from "helmet";
import morgan from "morgan";
import { connectToPrismaDatabase, instanceMongodb } from "./config/database.ts";
import { checkConnect } from "./utils/helpers/checkConnect.ts";
import router from "./routes/index.ts";
const app = express();

//init middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

connectToPrismaDatabase();
instanceMongodb;
// checkConnect();

export default app;
