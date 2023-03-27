import {Router} from 'express';
import {QuoteRecord} from "../records/quote.record";


export const quotationsRouter = Router();

quotationsRouter
    .get('/', async (req, res) => {
        const quotationsList = await QuoteRecord.listAll();
        res.json({
            quotationsList,
        });
    })

    .get('/:quoteId', async (req, res) => {
        const quote = await QuoteRecord.getOne(req.params.quoteId);

        res.json({
            quote,
        });
    })

    .delete('/:id', async (req, res) => {
        const quote = await QuoteRecord.getOne(req.params.id);

        if (!quote) {
            throw new Error('Nie posiadasz takiego cytatu w swoich notatkach');
        }

        await quote.delete();
        res.end();
    })

    .post('/', async (req, res) => {
        const newQuote = new QuoteRecord(req.body);
        await newQuote.insert();

        res.json(newQuote);
    })
