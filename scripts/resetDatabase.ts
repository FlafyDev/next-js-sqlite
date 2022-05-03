#!/usr/bin/env node

import { db, getArticles, getUsers, initializeTables } from "../lib/db";
import fs from "fs/promises";
import moment from "moment";
import { Gender } from "../models/user";

(async () => {
  try {
    await fs.mkdir("./databases/");
  } catch {}
  try {
    await fs.rm("./databases/database.db");
  } catch {}

  await initializeTables();
  await getUsers().insert({
    username: "Admin",
    password: "AdminAdmin",
    email: "Admin@gmail.com",
    firstName: "Mr.",
    lastName: "Admin",
    age: 20,
    gender: Gender.Male,
    isAdmin: true,
  });

  await getUsers().insert({
    username: "User",
    password: "UserUser",
    email: "User@gmail.com",
    firstName: "Mr.",
    lastName: "User",
    age: 18,
    gender: Gender.Male,
    isAdmin: false,
  });

  await getArticles().insert({
    content: `
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.
    An article for <b>testing</b>.`,
    title: "Test Article",
    lastUpdated: moment().subtract(10, "days").valueOf(),
  });

  await db.destroy();
})();
