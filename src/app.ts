import cors from "cors";
import express from "express";
import "express-async-errors";
import dotenv from "dotenv"
dotenv.config()
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import recommendationRouter from "./routers/recommendationRouter";
import testRecommendationRouter from "./routers/testRecommendationRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
if (process.env.NODE_ENV === "test") {
    app.use(testRecommendationRouter);
}

app.use(errorHandlerMiddleware);

export default app;
