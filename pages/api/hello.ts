// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import knex from 'knex'

console.log(resolve("."));


(async () => {
  const db = knex({
    client: 'sqlite3',
    connection: {
      filename: './databases/database.db',
    },
  });
  
  await db.schema.createTableIfNotExists('users', (table) => {
    table.increments('id', {
      primaryKey: true,
    });
    table.string('username');
    table.string('password');
    table.string('email');
  });
  
  await db("users").insert({ username: "Flafy", password: "123123", email: "CoolMail@gmail.com"});
})()

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ name: "John Doe" });
}
