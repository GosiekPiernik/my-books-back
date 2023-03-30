import {Router} from 'express';
import {BookRecord} from "../records/book.record";

export const addRouter = Router();

addRouter

    .post('/', async (req, res) => {
        const newBook = new BookRecord(req.body);
        await newBook.insert();

        res.json(newBook);
    })
