import cors from "cors";
import express from "express";
import './utils/db';
import {booksRouter} from "./routers/booksRouter";
import {quotationsRouter} from "./routers/quotationsRouter";
import {addRouter} from "./routers/addRouter"


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());

app.use('/mybooks', booksRouter)
app.use('/addbook', addRouter)
app.use('/quotations', quotationsRouter)
app.listen(3001, "0.0.0.0", () => {
    console.log('Listening on port 3000')
});