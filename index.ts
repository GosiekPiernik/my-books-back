import express, {json} from "express";
import cors from "cors"
// import './utils.db'
import {addRouter} from "./routers/addRouter";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(json());

app.use('/addbook', addRouter)

app.listen(3001, "0.0.0.0", () => {
    console.log('Listening on port 3000')
})