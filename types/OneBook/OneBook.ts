export interface OneBook {
    id: string,
    title: string,
    firstAuthor: string,
    secondAuthor?: string,
    publishedDate: number,
    ISBNNumber: number,
    type: string,
    opinion: number
}