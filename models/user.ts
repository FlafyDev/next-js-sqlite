export default class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public email: string,
    public isAdmin: boolean
  ) {}
}
