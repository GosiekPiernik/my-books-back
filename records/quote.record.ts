import {v4 as uuid} from "uuid"
import {FieldPacket} from "mysql2";
import {OneQuote} from "../types";
import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";

type QuoteResult = [QuoteRecord[], FieldPacket[]];

export class QuoteRecord implements OneQuote {
    id: string;
    quote: string;
    author: string;
    book: string;

    constructor(obj: OneQuote) {
        if (obj.quote.length > 300) {
            throw new ValidationError('Wpisywany cytat powinien mieć mniej niż 300 znaków')
        }
        this.id = obj.id;
        this.quote = obj.quote;
        this.author = obj.author;
        this.book = obj.book;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `quotations` VALUES( :id, :quote, :author, :book)", {
            id: this.id,
            quote: this.quote,
            author: this.author,
            book: this.book
        })
        return this.id
    }

    static async getOne(id: string) {
        const [results] = await pool.execute("SELECT FROM `quotations` WHERE `id` = :id", {
            id
        }) as QuoteResult
        return results.length === 0 ? null : new QuoteRecord(results[0])
    }

    static async listAll(): Promise<QuoteRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `quotations`") as QuoteResult
        return results.map(obj => new QuoteRecord(obj));
    }

    async delete() {
        await pool.execute("DELETE FROM `quotations` WHERE `id` = :id", {
            id: this.id
        });
    }
}