import { getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";
import _ from "lodash-es";
import validateUser, { ValidationResult } from "../../../lib/validateUser";
import User from "../../../models/user";

const registrationKeys = ["username", "password", "email"];

export default withSessionRoute(async (req, res) => {
  let message = "";
  if (req.method !== "POST") {
    res.status(405).send; // Incorrect request method
  } else if (!_.isEqual(Object.keys(req.body), registrationKeys)) {
    res.status(400); // Bad input
  } else {
    const validationResult = await validateUser(req.body as User);

    if (validationResult === ValidationResult.None) {
      await getUsers().insert({
        ...req.body,
      });
      res.status(200);
    } else {
      message = ValidationResult[validationResult]; // Converts the enum to string
      res.status(400);
    }
  }
  res.send(message);
});
