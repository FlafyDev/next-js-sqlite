import { getUsers, initializeTables } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";
import _ from "lodash-es";
import validateUser, { ValidationResult } from "../../../lib/validateUser";
import User from "../../../models/user";

const registrationKeys = ["username", "password", "email"].sort();

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send(""); // Incorrect request method
    return;
  }

  if (!_.isEqual(Object.keys(req.body).sort(), registrationKeys)) {
    res.status(400).send(""); // Bad input
    return;
  }

  const validationResult = await validateUser(req.body as User);

  if (validationResult !== ValidationResult.None) {
    res.status(400).send(ValidationResult[validationResult]); // Converts the enum to string
    return;
  }

  await getUsers().insert({
    ...req.body,
    isAdmin: false,
  });

  res.status(200).send("");
});
