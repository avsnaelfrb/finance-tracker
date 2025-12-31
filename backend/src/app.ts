import  express, { type Application } from "express";
import errorHandler from "./middleware/errorMiddleware.js";
import indexRoute from './routes/indexRoute.js'
import cors from 'cors'

const app: Application = express()
const corsOption = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}

app.use(cors(corsOption))
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRoute)

app.use(errorHandler)

export default app