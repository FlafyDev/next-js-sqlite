import User from "../models/user";

const resultToString = async (res: Response) =>
  res.status === 200 ? "" : (await res.text()) ?? `Error ${res.status}`;

export const apiRegister = async (
  username: string,
  password: string,
  email: string
) => {
  const res = await fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });

  return await resultToString(res);
};

export const apiLogin = async (username: string, password: string) => {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return res.status;
};

export const apiLogout = async (username: string, password: string) => {
  const res = await fetch("/api/users/logout", {
    method: "POST",
  });

  return await resultToString(res);
};

export const apiEdit = async (
  idToEdit: number,
  propertiesToEdit: Partial<User>,
  _delete: boolean = false
) => {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idToEdit,
      ...propertiesToEdit,
      delete: _delete,
    }),
  });

  return await resultToString(res);
};

// Fails silently.
export const apiGetAllUsers = async () => {
  const res = await fetch("/api/users/getAll", { method: "POST" });
  return res.status === 200 ? ((await res.json()) as User[]) : [];
};

export const apiCurrentUser = async () => {
  const res = await fetch("/api/users/currentUser", { method: "POST" });
  return res.status === 200 ? ((await res.json()) as User) : null;
};
