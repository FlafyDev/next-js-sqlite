import LeaderBoardEntry from "../models/leaderBoardEntry";
import User, { Gender } from "../models/user";
import { ValidationResult } from "./validateUser";

const resultToString = async (res: Response) =>
  res.status === 200 ? "" : (await res.text()) ?? `Error ${res.status}`;

export const apiRegister = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  age: number,
  gender: Gender
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
      firstName,
      lastName,
      age,
      gender,
    }),
  });

  return parseInt(await res.text()) as ValidationResult;
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

export const apiLogout = async () => {
  const res = await fetch("/api/users/logout", {
    method: "POST",
  });

  return res.status;
};

export const apiEditUser = async (
  idToEdit: number,
  propertiesToEdit: Partial<User>,
  _delete: boolean = false
) => {
  const res = await fetch("/api/users/edit", {
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

export const apiLikeArticle = async (articleId: number, like: boolean) => {
  const res = await fetch("/api/articles/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      articleId,
      like,
    }),
  });
  return res.status === 200
    ? ((await res.json()) as { liked: boolean; likes: number })
    : null;
};

export const apiAddArticle = async (title: string, content: string) => {
  const res = await fetch("/api/articles/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  return res.status;
};

export const apiRemoveArticle = async (id: number) => {
  const res = await fetch("/api/articles/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });

  return res.status;
};

export const apiGameReward = async (hints: number, switches: number) => {
  const res = await fetch("/api/gameReward", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hints,
      switches,
    }),
  });

  return res.status === 200
    ? ((await res.json()) as { currentPoints: number; pointsReceived: number })
    : null;
};
