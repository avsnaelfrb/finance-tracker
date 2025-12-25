import  express, { type Application } from "express";
import errorHandler from "./middleware/errorMiddleware.js";

const app: Application = express()

app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)

export default app