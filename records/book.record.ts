import {OneBook} from "../types";
import {v4 as uuid} from "uuid";
import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type BookResults = [BookRecord[], FieldPacket[]];

export class BookRecord implements OneBook {
    id?: string;
    title: string;
    mainAuthor: string;
    publishedDate: number;
    ISBNNumber: number;
    type: string;
    dateOfReading: Date;
    opinion: number;

    constructor(obj: OneBook) {
        if (!obj.title || obj.title.length > 100) {
            throw new ValidationError('Musisz podać tytuł książki. Tytuł powinien zawierać do 100 znaków');
        }
        if (!obj.mainAuthor || obj.mainAuthor.length > 100) {
            throw new ValidationError("Uzupełnij imię i nazwisko autora. Możesz użyć 100 znaków")
        }

        if (!obj.type) {
            throw new ValidationError('Wybierz dominujący typ książki')
        }
        if (!obj.opinion) {
            throw new ValidationError('Musisz dokonać oceny przeczytanej książki')
        }

        this.id = obj.id;
        this.title = obj.title;
        this.mainAuthor = obj.mainAuthor;
        this.publishedDate = obj.publishedDate;
        this.ISBNNumber = obj.ISBNNumber;
        this.type = obj.type;
        this.dateOfReading = obj.dateOfReading;
        this.opinion = obj.opinion;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `books` VALUES(:id, :title, :mainAuthor, :publishedDate, :ISBNNumber, :type, :dateOfReading, :opinion)", {
            id: this.id,
            title: this.title,
            mainAuthor: this.mainAuthor,
            publishedDate: this.publishedDate,
            ISBNNumber: this.ISBNNumber,
            type: this.type,
            dateOfReading: this.dateOfReading,
            opinion: this.opinion
        })
        return this.id;
    }

    static async listAll(): Promise<BookRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `books`") as BookResults;
        return results.map(obj => new BookRecord(obj));
    }

    static async listAllWithDate(): Promise<BookRecord[]> {
        const [dateResult] = await pool.execute("SELECT * FROM `books` WHERE `dateOfReading` BETWEEN '2023-01-01' AND '2023-12-31'") as BookResults;
        return dateResult.map(obj => new BookRecord(obj));
    }

    static async getOne(id: string) {
        const [results] = await pool.execute("SELECT * FROM `books` WHERE `id` = :id ", {
            id
        }) as BookResults
        return results.length === 0 ? null : new BookRecord(results[0])
    }

    async delete() {
        await pool.execute("DELETE FROM `books` WHERE `id` = :id", {
            id: this.id,
        });
    }


}