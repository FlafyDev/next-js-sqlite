import { getUsers } from "../../../lib/db";
import { validatePassword, validateUsername } from "../../../lib/validateUser";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  // Need password and username for logging in, so validate if they are syntactically correct.
  if (
    !validatePassword(req.body.password) ||
    !validateUsername(req.body.username)
  ) {
    res.status(400).send("Invalid username or password");
    return;
  }

  const user = await getUsers().where("username", req.body.username).first();

  if (user?.password !== req.body.password) {
    res.status(403).send("Wrong username or password");
    return;
  }

  req.session.id = user!.id;
  await req.session.save();
  res.status(200).send("");
});
