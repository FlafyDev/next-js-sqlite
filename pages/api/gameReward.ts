import { getUsers } from "../../lib/db";
import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  if (
    !req.session.id ||
    typeof req.body["hints"] != "number" ||
    typeof req.body["switches"] != "number"
  ) {
    res.status(400).send("");
    return;
  }

  const userSQL = getUsers().where("id", req.session.id).first();
  const user = await userSQL;

  if (!user) {
    res.status(401).send("");
    return;
  }

  const hintsTaken = req.body["hints"] as number;
  const switchesDone = req.body["switches"] as number;
  let pointsReceived =
    Math.round(
      100 *
        (1 - Math.log(hintsTaken / 2 + Math.min(switchesDone - 10, 0) / 10 + 1))
    ) || 100;
  pointsReceived = pointsReceived > 0 ? pointsReceived : 0;

  await userSQL.update({
    points: user.points + pointsReceived,
    leastSwitches:
      user.leastSwitches > switchesDone || user.leastSwitches === -1
        ? switchesDone
        : user.leastSwitches,
  });

  res.status(200).send(
    JSON.stringify({
      currentPoints: user.points + pointsReceived,
      pointsReceived,
    })
  );
});
