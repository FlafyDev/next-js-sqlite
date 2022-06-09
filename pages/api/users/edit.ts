import { omit } from "lodash-es";
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

  const deleteUser = !!req.body?.delete ?? false;
  const userIdToModify = req.body?.id;

  if (typeof userIdToModify !== "number") {
    res.status(400).send("");
    return;
  }

  const userToModify = getUsers().where("id", userIdToModify);

  if (deleteUser) {
    // Remove likes the user did on articles.
    let articles = await getArticles();
    articles = articles.filter((article) =>
      new RegExp(`\\D+${userIdToModify}\\D+`).test(article.likedBy)
    );
    for (const article of articles) {
      let likedBy = JSON.parse(article.likedBy) as number[];
      likedBy = likedBy.filter((id) => id !== userIdToModify);
      await getArticles()
        .where("id", article.id)
        .first()
        .update("likedBy", JSON.stringify(likedBy));
    }

    // Remove the user.
    await userToModify.delete();
  } else {
    await userToModify.update({
      ...omit(req.body, ["id", "delete"]),
    });
  }

  res.status(200).send("");
});
