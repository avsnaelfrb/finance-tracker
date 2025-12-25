import  express, { type Application } from "express";
import errorHandler from "./middleware/errorMiddleware.js";
import indexRoute from './routes/indexRoute.js'

const app: Application = express()

app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)
app.use('/api', indexRoute)

export default app