import { Knex, knex } from "knex";
import User from "../models/user";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./databases/database.db",
  },
});

export const getUsers = (): Knex.QueryBuilder<User, User[]> => db("users");

export const initializeTables = async () => {
  if (!(await db.schema.hasTable("users"))) {
    await db.schema.createTable("users", (table) => {
      table.increments("id", {
        primaryKey: true,
      });
      table.string("username");
      table.string("password");
      table.string("email");
    });
  }
};
