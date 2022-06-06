import { Knex, knex } from "knex";
import path from "path";
import Article from "../models/article";
import User from "../models/user";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve("./databases/database.db"),
  },
});

export const getUsers = (): Knex.QueryBuilder<User, User[]> => db("users");
export const getArticles = (): Knex.QueryBuilder<Article, Article[]> =>
  db("articles");

export const initializeTables = async () => {
  if (!(await db.schema.hasTable("users"))) {
    await db.schema.createTable("users", (table) => {
      table.increments("id", {
        primaryKey: true,
      });
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.string("email").notNullable();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.integer("age").defaultTo(1);
      table.string("gender").defaultTo("other");
      table.integer("points").defaultTo(100);
      table.integer("leastSwitches").defaultTo(-1);
      table.boolean("isAdmin").defaultTo(false);
    });
  }

  if (!(await db.schema.hasTable("articles"))) {
    await db.schema.createTable("articles", (table) => {
      table.increments("id", {
        primaryKey: true,
      });
      table.string("title").notNullable();
      table.string("content").notNullable();
      table.string("likedBy").defaultTo("[]"); // JSON.stringify
      table.integer("lastUpdated").notNullable();
    });
  }
};
