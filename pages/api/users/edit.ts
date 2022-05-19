import { omit } from "lodash-es";
import { getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  if (
    !(
      req.session.id &&
      (await getUsers().where("id", req.session.id).first())?.isAdmin
    )
  ) {
    res.status(401).send("");
    return;
  }

  const deleteUser = !!req.body?.delete ?? false;
  const userIdToModify = req.body?.id;

  if (typeof userIdToModify !== "number") {
    res.status(400).send("");
    return;
  }

  const userToModify = getUsers().where("id", userIdToModify);

  if (deleteUser) {
    await userToModify.delete();
  } else {
    await userToModify.update({
      ...omit(req.body, ["id", "delete"]),
    });
  }

  res.status(200).send("");
});
