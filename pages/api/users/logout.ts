import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  req.session.id = undefined;
  await req.session.save();
  res.status(200).send("");
});
