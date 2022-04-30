export default class Article {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public likedBy: string, // number[] but SQL doesn't have arrays
    public lastUpdated: number
  ) {}
}
