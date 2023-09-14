import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import { default as helmet } from "helmet";
import morgan from "morgan";
import { connectToPrismaDatabase, instanceMongodb } from "./config/database.ts";
import { checkConnect } from "./utils/helpers/checkConnect.ts";
import router from "./routes/index.ts";
const app = express();

connectToPrismaDatabase();
instanceMongodb;
// checkConnect();

//init middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use("/api/v1", router);

//handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  (error as any).statusCode = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || "500";
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    ...(error.subMessage && { subMessage: error.subMessage }),
    message: error.message || "Internal Server Error",
  });
});

export default app;
