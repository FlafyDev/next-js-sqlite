import _ from "lodash";
import { getArticles, getUsers } from "../../../lib/db";
import { withSessionRoute } from "../../../lib/withSession";

const properties = ["like", "articleId"].sort();

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  if (
    !(req.session.id && (await getUsers().where("id", req.session.id).first()))
  ) {
    res.status(401).send("");
    return;
  }

  console.log(Object.keys(req.body));
  if (!_.isEqual(Object.keys(req.body).sort(), properties)) {
    res.status(400).send(""); // Bad input
    return;
  }

  const articleRow = getArticles().where("id", req.body.articleId).first();
  const article = await articleRow; // SQL row to object (Article)
  if (!article) {
    res.status(404).send("");
    return;
  }

  let likedBy = JSON.parse(article.likedBy) as number[];

  if (req.body.like) {
    likedBy.push(req.session.id as number);
  } else {
    likedBy = likedBy.filter((id) => id !== (req.session.id as number));
  }

  likedBy = Array.from(new Set(likedBy)); // Removes duplicates

  await articleRow.update("likedBy", JSON.stringify(likedBy));

  res.status(200).json({ liked: req.body.like, likes: likedBy.length });
});
