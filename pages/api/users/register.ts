import { getUsers, initializeTables } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";
import _ from "lodash-es";
import validateUser, { ValidationResult } from "../../../lib/validateUser";
import User from "../../../models/user";

const registrationKeys = [
  "username",
  "password",
  "email",
  "firstName",
  "lastName",
  "age",
  "gender",
].sort();

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send(""); // Incorrect request method
    return;
  }

  if (!_.isEqual(Object.keys(req.body).sort(), registrationKeys)) {
    res.status(400).send(""); // Bad input
    return;
  }

  const requestedUser = req.body as User;

  let validationResult = validateUser(requestedUser);

  if (validationResult === ValidationResult.None) {
    if (
      (
        await getUsers().whereRaw(
          "LOWER(username) LIKE ?",
          `${requestedUser.username.toLowerCase()}`
        )
      ).length
    ) {
      validationResult = ValidationResult.TakenUsername;
    } else if (
      (
        await getUsers().whereRaw(
          "LOWER(email) LIKE ?",
          `${requestedUser.email.toLowerCase()}`
        )
      ).length
    ) {
      validationResult = ValidationResult.TakenEmail;
    }
  }

  if (validationResult !== ValidationResult.None) {
    res.status(400).send(validationResult);
    return;
  }

  await getUsers().insert({
    ...requestedUser,
    isAdmin: false,
  });

  res.status(200).send(validationResult);
});
