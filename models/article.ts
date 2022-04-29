export default class Article {
  constructor(
    public title: string,
    public content: string,
    public likedBy: number[],
    public lastUpdated: number,
  ) {}
}