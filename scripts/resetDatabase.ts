#!/usr/bin/env node

import { db, getArticles, getUsers, initializeTables } from "../lib/db";
import fs from "fs/promises";
import moment from "moment";

(async () => {
  try {
    await fs.rm("./databases/database.db");
  } catch {}

  await initializeTables();
  await getUsers().insert({
    username: "Admin",
    password: "AdminAdmin",
    email: "Admin@gmail.com",
    isAdmin: true,
  });

  await getUsers().insert({
    username: "User",
    password: "UserUser",
    email: "User@gmail.com",
    isAdmin: false,
  });

  await getArticles().insert({
    content: "An article for <b>testing</b>.",
    title: "Test Article",
    lastUpdated: moment().subtract(10, "days").valueOf(),
  });

  await db.destroy();
})();
