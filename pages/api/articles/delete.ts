import _ from "lodash";
import { getArticles, getUsers } from "../../../lib/db";
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

  if (!_.isEqual(Object.keys(req.body), ["id"])) {
    res.status(400).send(""); // Bad input
    return;
  }

  await getArticles().where("id", req.body.id).delete();

  res.status(200).send("");
});
