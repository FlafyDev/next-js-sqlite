import { getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.session.id === undefined) {
    res.status(401).send("");
  }

  const user = await getUsers().where("id", req.session.id).first();
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).send("Couldn't find user with that id");
  }
});
