import {Router} from 'express';
import {BookRecord} from "../records/book.record";

export const addRouter = Router();

addRouter
    .get('/', async (req, res) => {
        const bookList = await BookRecord.listAll();
        res.json({
            bookList,
        });
    })

    .get('/:bookId', async (req, res) => {
        const book = await BookRecord.getOne(req.params.bookId);

        res.json({
            book,
        });
    })

    .delete('/:id', async (req, res) => {
        const book = await BookRecord.getOne(req.params.id);

        if (!book) {
            throw new Error('Takiej książki nie ma w Twojej bibliotece');
        }

        await book.delete();
        res.end();
    })

    .post('/', async (req, res) => {
        const newBook = new BookRecord(req.body);
        await newBook.insert();

        res.json(newBook);
    })
