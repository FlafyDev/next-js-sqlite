class LoginHistoryEntry {
  constructor(
    public id: number,
    public username: string,
    public date: number,
    public successful: boolean
  ) {}
}

export default LoginHistoryEntry;
