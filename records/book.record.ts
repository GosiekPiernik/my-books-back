import {OneBook} from "../types";
import {v4 as uuid} from "uuid";
import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type BookResults = [BookRecord[], FieldPacket[]];

export class BookRecord implements OneBook {
    id: string;
    title: string;
    firstAuthor: string;
    secondAuthor?: string;
    publishedDate: number;
    ISBNNumber: number;
    type: string;
    opinion: number;

    constructor(obj: OneBook) {
        if (!obj.title || obj.title.length > 100) {
            throw new ValidationError('Musisz podać tytuł książki. Tytuł powinien zawierać do 100 znaków');
        }
        if (!obj.firstAuthor || obj.firstAuthor.length > 100) {
            throw new ValidationError("Uzupełnij imię i nazwisko autora. Możesz użyć 100 znaków")
        }
        // if (obj.publishedDate !== 4) {
        //     throw new ValidationError('Wpisz rok wydania')
        // }
        if (!obj.type) {
            throw new ValidationError('Wybierz dominujący typ książki')
        }
        if (!obj.opinion) {
            throw new ValidationError('Musisz dokonać oceny przeczytanej książki')
        }

        this.id = obj.id;
        this.title = obj.title;
        this.firstAuthor = obj.firstAuthor;
        this.secondAuthor = obj.secondAuthor;
        this.publishedDate = obj.publishedDate;
        this.ISBNNumber = obj.ISBNNumber;
        this.type = obj.type;
        this.opinion = obj.opinion;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `books` VALUES (:id, :title, :firstAuthor, :secondAuthor, :publishedDate, :ISBNNumber, :type, :opinion)", {
            id: this.id,
            title: this.title,
            firstAuthor: this.firstAuthor,
            secondAuthor: this.secondAuthor,
            publishedDate: this.publishedDate,
            ISBNNumber: this.ISBNNumber,
            type: this.type,
            opinion: this.opinion
        })
        return this.id;
    }

    static async listAll(): Promise<BookRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `books`") as BookResults;
        return results.map(obj => new BookRecord(obj));
    }

    static async getOne(id: string) {
        const [results] = await pool.execute("SELECT * FROM `books` WHERE `id` = :id ", {
            id
        }) as BookResults
        return results.length === 0 ? null : new BookRecord(results[0])
    }

    async delete() {
        await pool.execute('DELETE FROM `books` WHERE `id` = :id', {
            id: this.id,
        });
    }
}