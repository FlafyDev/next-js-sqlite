import { getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  const users = await getUsers();
  if (users.find((user) => user.id === req.session.id)?.isAdmin) {
    res.status(200).json(users);
    return;
  }
  res.status(401).send("");
});
