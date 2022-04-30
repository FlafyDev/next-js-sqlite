import _ from "lodash";
import { getArticles, getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";

const articleProperties = ["title", "content"].sort();

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

  if (!_.isEqual(Object.keys(req.body).sort(), articleProperties)) {
    res.status(400).send(""); // Bad input
    return;
  }

  await getArticles().insert({
    ...req.body,
    lastUpdated: Date.now(),
  });

  res.status(200).send("");
});
